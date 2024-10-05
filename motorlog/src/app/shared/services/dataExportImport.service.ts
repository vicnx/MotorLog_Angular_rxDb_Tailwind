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

@Injectable({ providedIn: 'root' })
export class DataExportImportService {
	dbSvc = inject(DBService);
	router = inject(Router);
	userSvc = inject(UserService);
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

			const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
			saveAs(blob, 'motorLog_backup.json');
			console.log('Datos exportados exitosamente.');
		} catch (error) {
			console.error('Error exportando datos:', error);
		}
	}
	public async importData(file: File): Promise<void> {
		try {
			console.log('Borrando la base de datos...');
			await removeRxDatabase('motorlog-db', getRxStorageDexie());
			console.log('Base de datos eliminada.');

			console.log('Recreando la base de datos...');
			await initDatabase(this.confirmationService);
			console.log('Base de datos recreada.');

			const fileContent = await file.text();
			const importedData = JSON.parse(fileContent);

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
			console.log('Datos importados exitosamente.');
		} catch (error) {
			console.error('Error importando datos:', error);
		}
	}

	public async clearAllData(): Promise<void> {
		try {
			const db = this.dbSvc.db;
			const collections = Object.keys(db.collections);

			for (const collectionName of collections) {
				const collection = db.collections[collectionName as keyof typeof db.collections] as unknown as RxCollection<any>;
				const allDocs = await collection.find().exec();
				await Promise.all(allDocs.map((doc) => doc.remove()));
			}
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
					icon: 'fas fa-exclamation-triangle',
					rejectButtonStyleClass: 'p-button-text',
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
