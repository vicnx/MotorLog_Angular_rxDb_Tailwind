import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { removeRxDatabase, RxCollection } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { DBService, initDatabase } from './db.service';
import { UserService } from './user.service';
import { GDriveService } from './gdrive.service';

@Injectable({ providedIn: 'root' })
export class DataExportImportService {
	dbSvc = inject(DBService);
	router = inject(Router);
	userSvc = inject(UserService);
	gdriveSvc = inject(GDriveService);
	confirmationService = inject(ConfirmationService);
	translateSvc = inject(TranslateService);
	messageSvc = inject(MessageService);
	spinnerSvc = inject(NgxSpinnerService);
	shouldShowBackupDialog = signal<boolean>(false);

	public async exportData(): Promise<void> {
		try {
			const db = this.dbSvc.db;
			const collections = Object.keys(db.collections);
			const dataToExport: Record<string, any[]> = {};

			for (const collectionName of collections) {
				const collection = db.collections[collectionName as keyof typeof db.collections] as unknown as RxCollection<any>;
				const allDocs = await collection.find().exec();
				dataToExport[collectionName] = allDocs.map((doc) => doc.toJSON());
			}

			const json = JSON.stringify(dataToExport, null, 2);
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);

			const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
			const isFirefoxIOS = /FxiOS/i.test(navigator.userAgent);

			if (isMobile && isFirefoxIOS) {
				window.open(url, '_blank');
			} else {
				saveAs(blob, 'motorLog_backup.json');
			}

			console.log('Datos exportados exitosamente.');
		} catch (error) {
			console.error('Error exportando datos:', error);
		}
	}

	public async exportDataAsJsonString(): Promise<string> {
		const db = this.dbSvc.db;
		const collections = Object.keys(db.collections);
		const dataToExport: Record<string, any[]> = {};

		for (const collectionName of collections) {
			const collection = db.collections[collectionName as keyof typeof db.collections] as unknown as RxCollection<any>;
			const allDocs = await collection.find().exec();
			dataToExport[collectionName] = allDocs.map((doc) => doc.toJSON());
		}

		return JSON.stringify(dataToExport, null, 2);
	}

	public async importDataFromJsonString(jsonContent: string): Promise<void> {
		const importedData = JSON.parse(jsonContent);
		const validationResult = this.validateImportedData(importedData);

		if (!validationResult.valid) {
			throw new Error('El JSON importado no es válido.');
		}

		console.log('Borrando la base de datos...');
		await removeRxDatabase('motorlog-db', getRxStorageDexie());
		console.log('Base de datos eliminada.');

		console.log('Recreando la base de datos...');
		await initDatabase();
		console.log('Base de datos recreada.');

		const collections = this.dbSvc.db.collections;

		for (const collectionName of Object.keys(importedData)) {
			const collection = collections[collectionName as keyof typeof collections] as unknown as RxCollection<any>;

			if (collection) {
				for (const docData of importedData[collectionName]) {
					await collection.upsert(docData);
				}
				console.log(`Datos importados en la colección "${collectionName}".`);
			} else {
				console.warn(`La colección "${collectionName}" no existe en la base de datos.`);
			}
		}

		this.userSvc.setLogginUser(false);
		location.reload();
	}

	public async importData(file: File): Promise<void> {
		const fileContent = await file.text();
		return this.importDataFromJsonString(fileContent);
	}

	public async clearAllData(): Promise<void> {
		try {
			// 1. Desconectar la cuenta de Google Drive si estaba conectada
			this.gdriveSvc.logout();

			// 2. Eliminar completamente la base de datos IndexedDB local
			console.log('Eliminando base de datos local...');
			await removeRxDatabase('motorlog-db', getRxStorageDexie());
			await initDatabase();

			// 3. Limpiar almacenamiento de sesión y almacenamiento local
			sessionStorage.clear();
			localStorage.clear();

			console.log('Todos los datos han sido eliminados exitosamente.');
			this.userSvc.setLogginUser(false);
			location.reload();
		} catch (error) {
			console.error('Error eliminando datos:', error);
		}
	}

	onFileSelected(event: Event): void {
		this.spinnerSvc.show();
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			file.text().then((fileContent) => {
				let importedData;
				try {
					importedData = JSON.parse(fileContent);
				} catch (jsonError) {
					this.messageSvc.add({
						severity: 'error',
						summary: 'Error',
						detail: 'El archivo está corrupto. Por favor, proporciona un archivo JSON válido.',
						key: 'toast'
					});
					return;
				}
				const validationResult = this.validateImportedData(importedData);

				if (!validationResult.valid) {
					this.spinnerSvc.hide();
					console.error('El JSON importado no es válido.');
					return;
				} else {
					this.spinnerSvc.hide();
				}

				this.confirmationService.confirm({
					message: this.translateSvc.instant('pages.settings.import_data.confirm.msg', {
						username: validationResult.username
					}),
					header: this.translateSvc.instant('confirm.default_header'),
					icon: 'fas fa-file-import text-primary-500 text-xl',
					acceptButtonStyleClass: 'btn-primary !py-2 !px-4 !text-xs',
					rejectButtonStyleClass: 'btn-secondary !py-2 !px-4 !text-xs',
					acceptLabel: this.translateSvc.instant('confirm.default_yes'),
					rejectLabel: this.translateSvc.instant('confirm.default_no'),
					key: 'confirmDialog',
					accept: () => {
						this.spinnerSvc.show();
						this.importData(file)
							.then(() => {
								this.spinnerSvc.hide();
							})
							.catch((error) => {
								this.spinnerSvc.hide();
								console.error('Error al importar los datos:', error);
							});
					},
					reject: () => {
						this.spinnerSvc.hide();
					}
				});
			});
		}
	}

	private validateImportedData(importedData: any): { valid: boolean; username?: string } {
		if (!importedData.user || !Array.isArray(importedData.user) || importedData.user.length === 0) {
			return { valid: false };
		}

		const user = importedData.user[0];
		if (!user.username) {
			return { valid: false };
		}

		if (!importedData.vehicles || !Array.isArray(importedData.vehicles)) {
			return { valid: false };
		}

		return { valid: true, username: user.username };
	}
}
