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
		MultiSelectModule
	],
	templateUrl: './maintenance-details.component.html'
})
export class MaintenanceDetailsComponent extends BaseComponent implements OnInit {
	isEdit: boolean = false;
	formBuilder = inject(FormBuilder);
	mantForm: FormGroup;
	currentVehicleInfo: VehicleModel;
	serviceTypes: any[];

	constructor() {
		super();
	}

	ngOnInit(): void {
		this.routeSvc.data.subscribe((data) => {
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
		this.userSvc.page.update((val) => (val = this.translateSvc.instant('pages.mant-details.add-mant.title')));
		this.mantForm.get('date')?.setValue(new Date());
		this.loadServiceTypes();
	}

	private initForm(): void {
		this.mantForm = this.formBuilder.group({
			date: [null, Validators.required],
			// time: [null],
			odometer: [0],
			serviceType: [null],
			location: [null],
			amount: [null],
			// files: [null],
			notes: ['']
		});
	}

	private loadServiceTypes(): void {
		this.vehicleSvc.getServiceTypes().subscribe({
			next: (resp) => {
				this.serviceTypes = resp.map((obj: any) => ({ ...obj, label: this.translateSvc.instant(obj.label) }));
			}
		});
	}

	public onSubmit(): void {
		this.vehicleSvc.addMaintenanceToVehicle(this.vehicleSvc.vehicleSelected().id, this.mantForm.value).subscribe({
			next: (res) => {
				this.showSuccess();
				this.routerSvc.navigate([this.const.routes.home]);
			}
		});
	}
}
