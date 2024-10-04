import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api'; // Para mostrar el mensaje de éxito
import { DataExportImportService } from '@shared/services/dataExportImport.service';

@Component({
	selector: 'app-backup-dialog-msg',
	standalone: true,
	imports: [CommonModule, DialogModule, ButtonModule, TranslateModule],
	templateUrl: './backup-dialog-msg.component.html',
	providers: [MessageService]
})
export class BackupDialogMsgComponent {
	dataSvc = inject(DataExportImportService);
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
}
