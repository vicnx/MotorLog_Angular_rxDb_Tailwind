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
	templateUrl: './gdrive-card.component.html',
	host: { class: 'block w-full' }
})
export class GDriveCardComponent {
	public gdriveSvc = inject(GDriveService);
	private dataSvc = inject(DataExportImportService);
	private spinnerSvc = inject(NgxSpinnerService);
	private confirmationSvc = inject(ConfirmationService);
	private translateSvc = inject(TranslateService);
	private messageSvc = inject(MessageService);

	public connectGDrive(): void {
		this.gdriveSvc.login(async () => {
			await this.checkAndPromptRestore();
		});
	}

	public disconnectGDrive(): void {
		this.gdriveSvc.logout();
	}

	private async checkAndPromptRestore(): Promise<void> {
		const existingBackup = await this.gdriveSvc.checkExistingBackup();
		if (existingBackup) {
			this.promptRestoreConfirmation(existingBackup.modifiedTime);
		}
	}

	private promptRestoreConfirmation(modifiedTime: string): void {
		const formattedDate = modifiedTime ? new Date(modifiedTime).toLocaleString() : '';
		this.confirmationSvc.confirm({
			message: this.translateSvc.instant('pages.settings.gdrive.found_backup_msg', { date: formattedDate }),
			header: this.translateSvc.instant('pages.settings.gdrive.found_backup_header'),
			icon: 'fas fa-cloud-download-alt text-primary-500 text-xl',
			acceptButtonStyleClass: 'btn-primary !py-2 !px-4 !text-xs',
			rejectButtonStyleClass: 'btn-secondary !py-2 !px-4 !text-xs',
			acceptLabel: this.translateSvc.instant('confirm.default_yes'),
			rejectLabel: this.translateSvc.instant('confirm.default_no'),
			key: 'confirmDialog',
			accept: () => {
				this.executeRestore();
			}
		});
	}

	public restoreFromGDrive(): void {
		this.confirmationSvc.confirm({
			message: this.translateSvc.instant('pages.settings.gdrive.confirm_restore_msg'),
			header: this.translateSvc.instant('pages.settings.gdrive.confirm_restore_header'),
			icon: 'fas fa-cloud-download-alt text-primary-500 text-xl',
			acceptButtonStyleClass: 'btn-primary !py-2 !px-4 !text-xs',
			rejectButtonStyleClass: 'btn-secondary !py-2 !px-4 !text-xs',
			acceptLabel: this.translateSvc.instant('confirm.default_yes'),
			rejectLabel: this.translateSvc.instant('confirm.default_no'),
			key: 'confirmDialog',
			accept: () => {
				this.executeRestore();
			},
			reject: () => {}
		});
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

	private async executeRestore(): Promise<void> {
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
	}
}
