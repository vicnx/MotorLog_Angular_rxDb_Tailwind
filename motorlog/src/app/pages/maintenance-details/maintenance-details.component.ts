import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { VehicleSelectorComponent } from '@shared/components/vehicle-selector/vehicle-selector.component';
import { VehicleModel } from '@shared/models/vehicle.model';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { MultiSelectModule } from 'primeng/multiselect';
import { Maintenance } from '@shared/models/maintenance.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
    ConfirmDialogModule
	],
	templateUrl: './maintenance-details.component.html'
})
export class MaintenanceDetailsComponent extends BaseComponent implements OnInit {
	isEdit: boolean = false;
	formBuilder = inject(FormBuilder);
	mantForm: FormGroup;
	currentVehicleInfo: VehicleModel;
	serviceTypes: any[];
	maintenanceData: Maintenance;

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
		this.userSvc.page.update((val) => (val = this.isEdit ? this.translateSvc.instant('pages.mant-details.edit-mant') : this.translateSvc.instant('pages.mant-details.add-mant.title')));
		this.mantForm.get('date')?.setValue(new Date());
		this.loadServiceTypes();
	}

	private initForm(): void {
		this.mantForm = this.formBuilder.group({
			date: [null, Validators.required],
			odometer: [0],
			serviceType: [null],
			location: [null],
			amount: [null],
			// files: [null],
			notes: [''],
			icon: null
		});
		this.checkEdit();
	}

  private checkEdit(): void {
    if (this.isEdit) {
			this.spinnerSvc.show();
			this.routeSvc.paramMap.subscribe((params) => {
				const maintenanceId = params.get('id') ?? '';
				const maintenance = this.vehicleSvc.getMaintenanceById(maintenanceId);
				console.log('Mantenimiento seleccionado', maintenance);
				if (maintenance) {
					this.mantForm.patchValue(maintenance);
					this.maintenanceData = maintenance;
					this.spinnerSvc.hide();
				} else {
					this.spinnerSvc.hide();
					console.error('Mantenimiento no encontrado');
					this.routerSvc.navigate([CONSTANTS.routes.home]);
				}
			});
		}
  }

	private loadServiceTypes(): void {
		this.vehicleSvc.getServiceTypes().subscribe({
			next: (resp: any) => {
				this.serviceTypes = resp.map((obj: any) => ({ ...obj, desc: this.translateSvc.instant(obj.label) }));
			}
		});
	}

	public onSubmit(): void {
		if (this.mantForm.valid) {
			//prettier-ignore
			const serviceTypes = this.mantForm.value.serviceType || [];
			const icon = serviceTypes?.[0]?.icon || null;
			this.mantForm.patchValue({ icon });
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
    console.log('deleteMaintenance')
    this.confirmationSvc.confirm({
      message: this.translateSvc.instant('pages.mant-details.delete_mant.confirm_msg'),
      header: this.translateSvc.instant('pages.mant-details.delete_mant.confirm_header'),
      icon: 'fas fa-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      acceptLabel:this.translateSvc.instant('confirm.default_yes'),
      rejectLabel:this.translateSvc.instant('confirm.default_no'),
      key: 'confirmDialog',
      accept: () => {
        this.spinnerSvc.show();
        this.vehicleSvc.deleteMaintenance(this.vehicleSvc.vehicleSelected().id,this.maintenanceData.id.toString()).subscribe({
          next: () =>{
            this.operationOK();
          }
        })
      },
      reject: () => {}
  });
  }
}
