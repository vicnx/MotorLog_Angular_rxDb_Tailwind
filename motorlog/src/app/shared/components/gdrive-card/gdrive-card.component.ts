import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataExportImportService } from '@shared/services/dataExportImport.service';
import { GDriveService } from '@shared/services/gdrive.service';

@Component({
	selector: 'app-gdrive-card',
	standalone: true,
	imports: [CommonModule, TranslateModule],
	templateUrl: './gdrive-card.component.html'
})
export class GDriveCardComponent {
	public gdriveSvc = inject(GDriveService);
	private dataSvc = inject(DataExportImportService);
	private spinnerSvc = inject(NgxSpinnerService);
	private confirmationSvc = inject(ConfirmationService);
	private translateSvc = inject(TranslateService);
	private messageSvc = inject(MessageService);

	public connectGDrive(): void {
		this.gdriveSvc.login();
	}

	public disconnectGDrive(): void {
		this.gdriveSvc.logout();
	}

	public async uploadToGDrive(): Promise<void> {
		this.spinnerSvc.show();
		try {
			const jsonString = await this.dataSvc.exportDataAsJsonString();
			await this.gdriveSvc.uploadBackup(jsonString);
		} finally {
			this.spinnerSvc.hide();
		}
	}

	public restoreFromGDrive(): void {
		this.confirmationSvc.confirm({
			message: this.translateSvc.instant('pages.settings.gdrive.confirm_restore_msg'),
			header: this.translateSvc.instant('pages.settings.gdrive.confirm_restore_header'),
			icon: 'fas fa-exclamation-triangle',
			rejectButtonStyleClass: 'p-button-text',
			acceptLabel: this.translateSvc.instant('confirm.default_yes'),
			rejectLabel: this.translateSvc.instant('confirm.default_no'),
			key: 'confirmDialog',
			accept: async () => {
				this.spinnerSvc.show();
				try {
					const jsonContent = await this.gdriveSvc.downloadBackupContent();
					if (jsonContent) {
						await this.dataSvc.importDataFromJsonString(jsonContent);
					}
				} catch (error) {
					console.error('Error al restaurar desde GDrive:', error);
				} finally {
					this.spinnerSvc.hide();
				}
			},
			reject: () => {}
		});
	}
}
