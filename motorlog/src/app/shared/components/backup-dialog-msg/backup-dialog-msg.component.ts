import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { DataExportImportService } from '@shared/services/dataExportImport.service';
import { GDriveService } from '@shared/services/gdrive.service';

@Component({
	selector: 'app-backup-dialog-msg',
	standalone: true,
	imports: [CommonModule, DialogModule, ButtonModule, TranslateModule],
	templateUrl: './backup-dialog-msg.component.html'
})
export class BackupDialogMsgComponent {
	dataSvc = inject(DataExportImportService);
	gdriveSvc = inject(GDriveService);
	messageSvc = inject(MessageService);
	displayDialog: boolean = false;

	constructor() {
		effect(() => {
			if (this.dataSvc.shouldShowBackupDialog()) {
				this.displayDialog = true;
			} else {
				this.displayDialog = false;
			}
		});
	}

	public hideDialog(): void {
		this.dataSvc.shouldShowBackupDialog.set(false);
	}

	public exportData(): void {
		this.dataSvc.exportData();
		this.hideDialog();
	}

	/**
	 * Exporta los datos directamente a la cuenta de Google Drive del usuario.
	 */
	public async uploadToGDrive(): Promise<void> {
		this.hideDialog();
		const jsonString = await this.dataSvc.exportDataAsJsonString();
		await this.gdriveSvc.uploadBackup(jsonString);
	}
}
