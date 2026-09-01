import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { GDriveCardComponent } from '@shared/components/gdrive-card/gdrive-card.component';
import { LangDropdownComponent } from '@shared/components/lang-dropdown/lang-dropdown.component';
import { DataExportImportService } from '@shared/services/dataExportImport.service';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';

export type SettingsView = 'main' | 'data';

@Component({
	selector: 'app-settings',
	standalone: true,
	templateUrl: './settings.component.html',
	imports: [
		CommonModule,
		TranslateModule,
		ButtonModule,
		TooltipModule,
		ConfirmDialogModule,
		GDriveCardComponent,
		LangDropdownComponent
	]
})
export class SettingsComponent extends BaseComponent implements OnInit {
	dataSvc = inject(DataExportImportService);
	currentView: SettingsView = 'main';

	@ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

	ngOnInit() {
		this.userSvc.page.set('pages.settings.settings');
	}

	goToDataManagement() {
		this.currentView = 'data';
	}

	backToMainSettings() {
		this.currentView = 'main';
	}

	goToProfile() {
		this.routerSvc.navigate([CONSTANTS.routes.profile]);
	}

	openPrivacy() {
		window.open('privacy-policy.html', '_blank');
	}

	openTerms() {
		window.open('terms-of-service.html', '_blank');
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
			icon: 'fas fa-exclamation-triangle text-red-500 text-xl',
			acceptButtonStyleClass: 'btn-danger !py-2 !px-4 !text-xs',
			rejectButtonStyleClass: 'btn-secondary !py-2 !px-4 !text-xs',
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

	fixMantIds(): void {
		this.confirmationSvc.confirm({
			message: this.translateSvc.instant('pages.settings.fixMant.confirm_msg'),
			header: this.translateSvc.instant('pages.settings.fixMant.confirm_header'),
			icon: 'fas fa-wrench text-primary-500 text-xl',
			acceptButtonStyleClass: 'btn-primary !py-2 !px-4 !text-xs',
			rejectButtonStyleClass: 'btn-secondary !py-2 !px-4 !text-xs',
			acceptLabel: this.translateSvc.instant('confirm.default_yes'),
			rejectLabel: this.translateSvc.instant('confirm.default_no'),
			key: 'confirmDialog',
			accept: () => {
				this.spinnerSvc.show();
				this.vehicleSvc.fixDuplicateMaintenanceIds(this.vehicleSvc.vehicleSelected()).subscribe({
					next: () => {
						this.spinnerSvc.hide();
						this.showSuccess();
					},
					error: (err: unknown) => {
						this.showErrorMsg(String(err));
						this.spinnerSvc.hide();
					}
				});
			},
			reject: () => {}
		});
	}
}
