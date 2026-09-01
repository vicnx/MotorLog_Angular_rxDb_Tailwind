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

	constructor() {
		// Diferir la restauración del token para evitar disparar interceptores HTTP durante la instanciación del DI (NG0200)
		setTimeout(() => {
			this.restoreSessionToken();
		}, 0);
	}

	public initTokenClient(onSuccessCallback?: () => void): void {
		if (typeof google !== 'undefined' && google.accounts?.oauth2) {
			this.tokenClient = google.accounts.oauth2.initTokenClient({
				client_id: environment.googleClientId,
				scope: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.email',
				callback: (response: any) => {
					if (response.access_token) {
						this.accessToken = response.access_token;
						this.isLoggedIn.set(true);
						sessionStorage.setItem('gdrive_token', response.access_token);
						this.fetchUserInfo();
						this.checkExistingBackup();
						if (onSuccessCallback) {
							onSuccessCallback();
						}
					}
				}
			});
		}
	}

	public login(onSuccess?: () => void): void {
		if (!this.tokenClient) {
			this.initTokenClient(onSuccess);
		}
		if (this.tokenClient) {
			this.tokenClient.requestAccessToken({ prompt: 'consent' });
		}
	}

	public logout(): void {
		if (this.accessToken && typeof google !== 'undefined' && google.accounts?.oauth2) {
			google.accounts.oauth2.revoke(this.accessToken, () => {});
		}
		this.accessToken = null;
		this.isLoggedIn.set(false);
		this.userEmail.set('');
		this.lastBackupDate.set('');
		sessionStorage.removeItem('gdrive_token');
	}

	private restoreSessionToken(): void {
		const savedToken = sessionStorage.getItem('gdrive_token');
		if (savedToken) {
			this.accessToken = savedToken;
			this.isLoggedIn.set(true);
			this.fetchUserInfo();
			this.checkExistingBackup();
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
					}
				},
				error: () => {
					this.logout();
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
				return file;
			}
		} catch (err) {
			console.error('Error al comprobar backup en GDrive:', err);
		}
		return null;
	}

	public async uploadBackup(jsonString: string): Promise<boolean> {
		if (!this.accessToken) {
			this.login(() => this.uploadBackup(jsonString));
			return false;
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

			this.lastBackupDate.set(new Date().toISOString());
			this.isSyncing.set(false);

			this.messageSvc.add({
				severity: 'success',
				summary: this.translateSvc.instant('msgs.success_header'),
				detail: this.translateSvc.instant('pages.settings.gdrive.upload_success'),
				key: 'toast'
			});

			return true;
		} catch (error) {
			this.isSyncing.set(false);
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
		if (!this.accessToken) return null;

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
		} catch (error) {
			this.isSyncing.set(false);
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
