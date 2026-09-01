import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';

declare const google: any;

export interface GDriveBackupFile {
	id: string;
	name: string;
	modifiedTime: string;
	size?: string;
}

@Injectable({ providedIn: 'root' })
export class GDriveService {
	private http = inject(HttpClient);
	private messageSvc = inject(MessageService);
	private translateSvc = inject(TranslateService);

	public isLoggedIn = signal<boolean>(false);
	public userEmail = signal<string>('');
	public isSyncing = signal<boolean>(false);
	public lastBackupDate = signal<string>('');

	private tokenClient: any;
	private accessToken: string | null = null;
	private tokenExpiresAt: number = 0;
	private pendingCallback: (() => void) | null = null;

	constructor() {
		// Restaurar estado persistido al iniciar el servicio
		setTimeout(() => {
			this.restoreSessionToken();
		}, 0);
	}

	public initTokenClient(onSuccessCallback?: () => void): void {
		if (onSuccessCallback) {
			this.pendingCallback = onSuccessCallback;
		}
		if (typeof google !== 'undefined' && google.accounts?.oauth2) {
			this.tokenClient = google.accounts.oauth2.initTokenClient({
				client_id: environment.googleClientId,
				scope: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.email',
				callback: (response: any) => {
					if (response.error) {
						console.error('Error de autenticación con Google:', response.error);
						return;
					}

					if (response.access_token) {
						// Validar que el usuario haya marcado la casilla del permiso de Google Drive
						const hasDrivePermission =
							(typeof google !== 'undefined' && google.accounts?.oauth2?.hasGrantedAllScopes)
								? google.accounts.oauth2.hasGrantedAllScopes(response, 'https://www.googleapis.com/auth/drive.appdata')
								: (response.scope && response.scope.includes('drive.appdata'));

						if (!hasDrivePermission) {
							this.messageSvc.add({
								severity: 'warn',
								summary: this.translateSvc.instant('msgs.error_header'),
								detail: this.translateSvc.instant('pages.settings.gdrive.permissions_required'),
								key: 'toast'
							});
							this.logout();
							return;
						}

						this.accessToken = response.access_token;
						const expiresIn = Number(response.expires_in) || 3599;
						this.tokenExpiresAt = Date.now() + expiresIn * 1000;

						this.isLoggedIn.set(true);
						localStorage.setItem('gdrive_token', response.access_token);
						localStorage.setItem('gdrive_token_expires_at', this.tokenExpiresAt.toString());
						localStorage.setItem('gdrive_account_linked', 'true');

						this.fetchUserInfo();
						this.checkExistingBackup();

						if (this.pendingCallback) {
							const cb = this.pendingCallback;
							this.pendingCallback = null;
							cb();
						}
					}
				}
			});
		}
	}

	public login(onSuccess?: () => void): void {
		if (onSuccess) {
			this.pendingCallback = onSuccess;
		}
		if (!this.tokenClient) {
			this.initTokenClient();
		}
		if (this.tokenClient) {
			const savedEmail = localStorage.getItem('gdrive_user_email');
			this.tokenClient.requestAccessToken({
				prompt: savedEmail ? '' : 'consent',
				hint: savedEmail || undefined
			});
		}
	}

	public logout(): void {
		if (this.accessToken && typeof google !== 'undefined' && google.accounts?.oauth2) {
			try {
				google.accounts.oauth2.revoke(this.accessToken, () => {});
			} catch (e) {}
		}
		this.accessToken = null;
		this.tokenExpiresAt = 0;
		this.isLoggedIn.set(false);
		this.userEmail.set('');
		this.lastBackupDate.set('');

		localStorage.removeItem('gdrive_token');
		localStorage.removeItem('gdrive_token_expires_at');
		localStorage.removeItem('gdrive_user_email');
		localStorage.removeItem('gdrive_account_linked');
		localStorage.removeItem('gdrive_last_backup');
	}

	private restoreSessionToken(): void {
		const isLinked = localStorage.getItem('gdrive_account_linked') === 'true';
		if (isLinked) {
			this.isLoggedIn.set(true);
			this.userEmail.set(localStorage.getItem('gdrive_user_email') || '');
			this.lastBackupDate.set(localStorage.getItem('gdrive_last_backup') || '');

			const savedToken = localStorage.getItem('gdrive_token');
			const expiresAt = Number(localStorage.getItem('gdrive_token_expires_at') || '0');

			// Si el token aún no ha caducado, restaurarlo
			if (savedToken && Date.now() < expiresAt - 60000) {
				this.accessToken = savedToken;
				this.tokenExpiresAt = expiresAt;
				this.fetchUserInfo();
				this.checkExistingBackup();
			} else {
				this.accessToken = null;
				this.tokenExpiresAt = 0;
			}
		}
	}

	private getHeaders(): HttpHeaders {
		return new HttpHeaders({
			Authorization: `Bearer ${this.accessToken}`
		});
	}

	public fetchUserInfo(): void {
		if (!this.accessToken) return;

		this.http
			.get<{ email?: string }>('https://www.googleapis.com/oauth2/v3/userinfo', {
				headers: this.getHeaders()
			})
			.subscribe({
				next: (info) => {
					if (info?.email) {
						this.userEmail.set(info.email);
						localStorage.setItem('gdrive_user_email', info.email);
					}
				},
				error: (err) => {
					if (err?.status === 401) {
						this.accessToken = null;
						localStorage.removeItem('gdrive_token');
					}
				}
			});
	}

	public async checkExistingBackup(): Promise<GDriveBackupFile | null> {
		if (!this.accessToken) return null;

		try {
			const res = await this.http
				.get<{ files: GDriveBackupFile[] }>(
					`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='motorLog_backup.json'&fields=files(id,name,modifiedTime,size)`,
					{ headers: this.getHeaders() }
				)
				.toPromise();

			if (res?.files && res.files.length > 0) {
				const file = res.files[0];
				this.lastBackupDate.set(file.modifiedTime);
				localStorage.setItem('gdrive_last_backup', file.modifiedTime);
				return file;
			}
		} catch (err: any) {
			if (err?.status === 401) {
				this.accessToken = null;
				localStorage.removeItem('gdrive_token');
			}
			console.error('Error al comprobar backup en GDrive:', err);
		}
		return null;
	}

	public async uploadBackup(jsonString: string): Promise<boolean> {
		if (!this.accessToken) {
			return new Promise((resolve) => {
				this.login(async () => {
					const result = await this.uploadBackup(jsonString);
					resolve(result);
				});
			});
		}

		this.isSyncing.set(true);

		try {
			const existingFile = await this.checkExistingBackup();
			const metadata = {
				name: 'motorLog_backup.json',
				mimeType: 'application/json',
				parents: existingFile ? undefined : ['appDataFolder']
			};

			const multipartBoundary = '-------314159265358979323846';
			const delimiter = `\r\n--${multipartBoundary}\r\n`;
			const closeDelimiter = `\r\n--${multipartBoundary}--`;

			const body =
				delimiter +
				'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
				JSON.stringify(metadata) +
				delimiter +
				'Content-Type: application/json\r\n\r\n' +
				jsonString +
				closeDelimiter;

			const headers = new HttpHeaders({
				Authorization: `Bearer ${this.accessToken}`,
				'Content-Type': `multipart/related; boundary=${multipartBoundary}`
			});

			let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
			let method = 'POST';

			if (existingFile) {
				url = `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart`;
				method = 'PATCH';
			}

			if (method === 'POST') {
				await this.http.post(url, body, { headers }).toPromise();
			} else {
				await this.http.patch(url, body, { headers }).toPromise();
			}

			const nowIso = new Date().toISOString();
			this.lastBackupDate.set(nowIso);
			localStorage.setItem('gdrive_last_backup', nowIso);
			this.isSyncing.set(false);

			this.messageSvc.add({
				severity: 'success',
				summary: this.translateSvc.instant('msgs.success_header'),
				detail: this.translateSvc.instant('pages.settings.gdrive.upload_success'),
				key: 'toast'
			});

			return true;
		} catch (error: any) {
			this.isSyncing.set(false);
			if (error?.status === 401) {
				this.accessToken = null;
				localStorage.removeItem('gdrive_token');
			}
			console.error('Error al subir backup a Google Drive:', error);

			this.messageSvc.add({
				severity: 'error',
				summary: this.translateSvc.instant('msgs.error_header'),
				detail: this.translateSvc.instant('pages.settings.gdrive.upload_error'),
				key: 'toast'
			});

			return false;
		}
	}

	public async downloadBackupContent(): Promise<string | null> {
		if (!this.accessToken) {
			return new Promise((resolve) => {
				this.login(async () => {
					const result = await this.downloadBackupContent();
					resolve(result);
				});
			});
		}

		this.isSyncing.set(true);

		try {
			const existingFile = await this.checkExistingBackup();

			if (!existingFile) {
				this.isSyncing.set(false);
				this.messageSvc.add({
					severity: 'warn',
					summary: this.translateSvc.instant('msgs.error_header'),
					detail: this.translateSvc.instant('pages.settings.gdrive.no_backup_found'),
					key: 'toast'
				});
				return null;
			}

			const content = await this.http
				.get(`https://www.googleapis.com/drive/v3/files/${existingFile.id}?alt=media`, {
					headers: this.getHeaders(),
					responseType: 'text'
				})
				.toPromise();

			this.isSyncing.set(false);
			return content || null;
		} catch (error: any) {
			this.isSyncing.set(false);
			if (error?.status === 401) {
				this.accessToken = null;
				localStorage.removeItem('gdrive_token');
			}
			console.error('Error al descargar backup desde Google Drive:', error);
			this.messageSvc.add({
				severity: 'error',
				summary: this.translateSvc.instant('msgs.error_header'),
				detail: this.translateSvc.instant('pages.settings.gdrive.download_error'),
				key: 'toast'
			});
			return null;
		}
	}
}
