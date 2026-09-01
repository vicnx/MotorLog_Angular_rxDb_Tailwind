import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { ActionRowComponent } from '@shared/components/action-row/action-row.component';
import { GDriveCardComponent } from '@shared/components/gdrive-card/gdrive-card.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DataExportImportService } from '@shared/services/dataExportImport.service';
import { VehiclesService } from '@shared/services/vehicles.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
	selector: 'app-data-management',
	standalone: true,
	imports: [
		CommonModule,
		TranslateModule,
		PageHeaderComponent,
		GDriveCardComponent,
		ActionRowComponent
	],
	templateUrl: './data-management.component.html'
})
export class DataManagementComponent {
	@ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
	@Output() back = new EventEmitter<void>();

	public dataSvc = inject(DataExportImportService);
	public vehicleSvc = inject(VehiclesService);
	private confirmationSvc = inject(ConfirmationService);
	private translateSvc = inject(TranslateService);
	private messageSvc = inject(MessageService);
	private router = inject(Router);

	public onBack(): void {
		this.back.emit();
	}

	public exportData(): void {
		this.messageSvc.add({
			severity: 'success',
			summary: this.translateSvc.instant('msgs.success_header'),
			detail: this.translateSvc.instant('pages.settings.export_data.success_msg'),
			key: 'toast'
		});
		this.dataSvc.exportData();
	}

	public importData(): void {
		this.fileInput.nativeElement.click();
	}

	public fixMantIds(): void {
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
				const current = this.vehicleSvc.vehicleSelected();
				if (current) {
					this.vehicleSvc.fixDuplicateMaintenanceIds(current).subscribe({
						next: () => {
							this.messageSvc.add({
								severity: 'success',
								summary: this.translateSvc.instant('msgs.success_header'),
								detail: this.translateSvc.instant('pages.settings.fixMant.success_msg'),
								key: 'toast'
							});
						}
					});
				}
			}
		});
	}

	public deleteData(): void {
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
					this.router.navigate([CONSTANTS.routes.welcome]);
				}, 500);
			}
		});
	}
}
