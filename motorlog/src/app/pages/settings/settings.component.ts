import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SettingsItemModel } from '@shared/models/menu.model';
import { BaseComponent } from '@shared/base.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu'; // Si usas el componente de menú de PrimeNG
import { DataExportImportService } from '@shared/services/dataExportImport.service';
import { CONSTANTS } from '@shared/app-constants';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
	selector: 'app-settings',
	standalone: true,
	templateUrl: './settings.component.html',
	imports: [CommonModule, HttpClientModule, TranslateModule, ButtonModule, TooltipModule, MenuModule, ConfirmDialogModule]
})
export class SettingsComponent extends BaseComponent implements OnInit {
	http = inject(HttpClient);
	settingsMenu: SettingsItemModel[] = [];
	dataSvc = inject(DataExportImportService);

	@ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

	ngOnInit() {
		this.userSvc.page.update((val) => (val = 'pages.settings.settings'));
		this.loadSettingsMenu();
	}

	loadSettingsMenu() {
		this.http.get<SettingsItemModel[]>('assets/data/settings-menu.json').subscribe(
			(data: any) => {
				this.settingsMenu = data.settingsMenu;
			},
			(error) => {
				console.error('Error loading settings menu:', error);
			}
		);
	}

	handleMenuAction(action: string) {
		switch (action) {
			case 'import':
				this.importData();
				break;
			case 'export':
				this.exportData();
				break;
			case 'delete':
				this.deleteData();
				break;
			case 'profile':
				this.routerSvc.navigate([CONSTANTS.routes.profile]);
				break;
			case 'fixmant':
				this.fixMantIds();
				break;
			default:
				console.warn('Action not found:', action);
		}
	}

	importData() {
		this.fileInput.nativeElement.click();
	}

	exportData() {
		this.showSuccess();
		this.dataSvc.exportData();
	}

	deleteData() {
		this.confirmationSvc.confirm({
			message: this.translateSvc.instant('pages.settings.delete_data.confirm_msg'),
			header: this.translateSvc.instant('pages.settings.delete_data.confirm_header'),
			icon: 'fas fa-exclamation-triangle',
			rejectButtonStyleClass: 'p-button-text',
			acceptLabel: this.translateSvc.instant('confirm.default_yes'),
			rejectLabel: this.translateSvc.instant('confirm.default_no'),
			key: 'confirmDialog',
			accept: () => {
				this.dataSvc.clearAllData();
				setTimeout(() => {
					this.routerSvc.navigate([CONSTANTS.routes.welcome]);
				}, 500);
			},
			reject: () => {}
		});
	}

	getTranslatedLabel(labelKey: string) {
		return this.translateSvc.instant(labelKey);
	}

	fixMantIds(): void {
		this.confirmationSvc.confirm({
			message: this.translateSvc.instant('pages.settings.fixMant.confirm_msg'),
			header: this.translateSvc.instant('pages.settings.fixMant.confirm_header'),
			icon: 'fas fa-exclamation-triangle',
			rejectButtonStyleClass: 'p-button-text',
			acceptLabel: this.translateSvc.instant('confirm.default_yes'),
			rejectLabel: this.translateSvc.instant('confirm.default_no'),
			key: 'confirmDialog',
			accept: () => {
        this.spinnerSvc.show();
        this.vehicleSvc.fixDuplicateMaintenanceIds(this.vehicleSvc.vehicleSelected()).subscribe({
          next: (res: any) => {
            this.spinnerSvc.hide();
            this.showSuccess()
          }, error: (err: any) => {
            this.showErrorMsg(err)
            this.spinnerSvc.hide();
          }
        })
			},
			reject: () => {}
		});
	}
}
