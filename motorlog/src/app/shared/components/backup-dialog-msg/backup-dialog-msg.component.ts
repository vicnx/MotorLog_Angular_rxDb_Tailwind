import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CONSTANTS } from '@shared/app-constants';
import { DataExportImportService } from '@shared/services/dataExportImport.service';

@Component({
	selector: 'app-backup-dialog-msg',
	standalone: true,
	imports: [CommonModule, DialogModule, ButtonModule, TranslateModule],
	templateUrl: './backup-dialog-msg.component.html'
})
export class BackupDialogMsgComponent {
	private router = inject(Router);
	dataSvc = inject(DataExportImportService);
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

	/**
	 * Cierra el modal y redirige a la pantalla de Ajustes para gestionar copias de seguridad.
	 */
	public goToSettings(): void {
		this.hideDialog();
		this.router.navigate([CONSTANTS.routes.settings]);
	}
}
