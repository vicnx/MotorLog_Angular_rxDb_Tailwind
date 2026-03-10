import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { ImageSelectorComponent } from '@shared/components/image-selector/image-selector.component';
import { VehicleSelectorComponent } from '@shared/components/vehicle-selector/vehicle-selector.component';
import { Maintenance } from '@shared/models/maintenance.model';
import { VehicleModel } from '@shared/models/vehicle.model';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { forkJoin } from 'rxjs';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustomServiceDetailsComponent } from '../custom-services-details/custom-services-details.component';
import { UtilsService } from '@shared/services/utils.service';
@Component({
	selector: 'app-add-vehicle',
	standalone: true,
	imports: [
		CommonModule,
		VehicleSelectorComponent,
		TranslateModule,
		FormsModule,
		ReactiveFormsModule,
		DropdownModule,
		ButtonModule,
		InputTextModule,
		CalendarModule,
		InputNumberModule,
		FileUploadModule,
		InputTextareaModule,
		InputMaskModule,
		MultiSelectModule,
		ConfirmDialogModule,
		ImageSelectorComponent,
		ButtonModule
	],
	providers: [DialogService],
	templateUrl: './maintenance-details.component.html'
})
export class MaintenanceDetailsComponent extends BaseComponent implements OnInit {
	isEdit: boolean = false;
	formBuilder = inject(FormBuilder);
	mantForm: FormGroup;
	currentVehicleInfo: VehicleModel;
	serviceTypes: any[];
	maintenanceData: Maintenance;
	dialogService = inject(DialogService);
	ref: DynamicDialogRef | undefined;

	constructor() {
		super();
	}

	ngOnInit(): void {
		this.routeSvc.data.subscribe((data: any) => {
			this.isEdit = data['isEdit'];
		});
		this.currentVehicleInfo = this.vehicleSvc.vehicleSelected();
		if (!this.currentVehicleInfo?.id) {
			this.routerSvc.navigate([CONSTANTS.routes.home]);
		}
		this.initForm();
		this.initUi();
	}

	private initUi(): void {
		//prettier-ignore
		this.userSvc.page.update((val) => (val = this.isEdit ? 'pages.mant-details.edit-mant' : 'pages.mant-details.add-mant.title'));
	}

	private initForm(): void {
		this.mantForm = this.formBuilder.group({
			date: [new Date(), Validators.required],
			odometer: [0],
			serviceType: [null],
			location: [null],
			amount: [null],
			imagen: [null],
			notes: [''],
			icon: null
		});

		this.mantForm.get('serviceType')?.valueChanges.subscribe((serviceTypes: any[]) => {
			if (serviceTypes.length > 0) {
				this.mantForm.patchValue({
					icon: serviceTypes[0].icon || null
				});
			} else {
				this.mantForm.patchValue({
					icon: null
				});
			}
		});
		this.checkEdit();
	}

	get imageControl(): FormControl {
		return this.mantForm.get('imagen') as FormControl;
	}

	private checkEdit(): void {
		if (this.isEdit) {
			this.spinnerSvc.show();
			this.routeSvc.paramMap.subscribe((params) => {
				const maintenanceId = params.get('id') ?? '';
				const maintenance = this.vehicleSvc.getMaintenanceById(maintenanceId);
				if (maintenance) {
					let mantPatch = { ...maintenance, date: new Date(maintenance.date) };
					this.mantForm.patchValue(mantPatch);
					this.maintenanceData = mantPatch;
					this.loadServiceTypes();
					this.spinnerSvc.hide();
				} else {
					this.spinnerSvc.hide();
					this.routerSvc.navigate([CONSTANTS.routes.home]);
				}
			});
		} else {
			this.loadServiceTypes();
		}
	}

	private loadServiceTypes(): void {
		forkJoin({
			serviceTypes: this.vehicleSvc.getServiceTypes(),
			customServices: this.userSvc.getCustomServices()
		}).subscribe({
			next: ({ serviceTypes, customServices }) => {
				let allOptions = [...serviceTypes, ...customServices];
				console.log(allOptions);
				console.log(this.maintenanceData);
				if (this.isEdit && this.maintenanceData?.serviceType) {
					this.maintenanceData.serviceType.forEach((savedService: any) => {
						const exists = allOptions.find((opt) => opt.value === savedService.value);
						if (!exists) {
							allOptions.push({
								...savedService,
								label: `${savedService.label} (Eliminado)`,
								isOrphan: true
							});
						}
					});
				}
				this.serviceTypes = allOptions.map((obj: any) => ({
					...obj,
					desc: obj.isOrphan ? obj.label : this.translateSvc.instant(obj.label)
				}));

				if (this.isEdit && this.maintenanceData) {
					this.mantForm.get('serviceType')?.patchValue(this.maintenanceData.serviceType);
				}
			}
		});
	}

	public onSubmit(): void {
		if (this.mantForm.valid) {
			//prettier-ignore
			if (this.isEdit) {
				this.editMaintenance();
			} else {
				this.newMaintenance();
			}
		} else {
			this.markFieldsAsTouched(this.mantForm);
		}
	}

	private newMaintenance(): void {
		this.spinnerSvc.show();
		this.vehicleSvc.addMaintenanceToVehicle(this.vehicleSvc.vehicleSelected().id, this.mantForm.value).subscribe({
			next: (res: any) => {
				this.operationOK();
			}
		});
	}

	private editMaintenance(): void {
		this.spinnerSvc.show();
		this.vehicleSvc.updateMaintenance(this.vehicleSvc.vehicleSelected().id, this.maintenanceData.id.toString(), this.mantForm.value).subscribe({
			next: () => {
				this.operationOK();
			}
		});
	}

	private operationOK(): void {
		this.showSuccess();
		this.vehicleSvc.getSavedVehicles();
		this.routerSvc.navigate([this.const.routes.home]);
		this.spinnerSvc.hide();
	}

	public deleteMaintenance(): void {
		console.log('deleteMaintenance');
		this.confirmationSvc.confirm({
			message: this.translateSvc.instant('pages.mant-details.delete_mant.confirm_msg'),
			header: this.translateSvc.instant('pages.mant-details.delete_mant.confirm_header'),
			icon: 'fas fa-exclamation-triangle',
			rejectButtonStyleClass: 'p-button-text',
			acceptLabel: this.translateSvc.instant('confirm.default_yes'),
			rejectLabel: this.translateSvc.instant('confirm.default_no'),
			key: 'confirmDialog',
			accept: () => {
				this.spinnerSvc.show();
				this.vehicleSvc.deleteMaintenance(this.vehicleSvc.vehicleSelected().id, this.maintenanceData.id.toString()).subscribe({
					next: () => {
						this.operationOK();
					}
				});
			},
			reject: () => {}
		});
	}

	public openAddCustomService(): void {
		this.ref = this.dialogService.open(CustomServiceDetailsComponent, {
			header: this.translateSvc.instant('pages.custom-services.add_customService'),
			width: '90%',
			contentStyle: { overflow: 'auto' },
			baseZIndex: 10000,
			data: { isModal: true }
		});

		this.ref.onClose.subscribe((result) => {
			this.loadServiceTypes();
		});
	}

	public isOrphan(value: any): boolean {
		return UtilsService.isServiceOrphan(value, this.serviceTypes);
	}
}
