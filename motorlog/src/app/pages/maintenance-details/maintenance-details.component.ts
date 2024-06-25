import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
@Component({
	selector: 'app-add-vehicle',
	standalone: true,
	imports: [CommonModule,
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
    InputMaskModule
	],
	templateUrl: './maintenance-details.component.html'
})
export class MaintenanceDetailsComponent extends BaseComponent implements OnInit {
	isEdit: boolean = false;
	formBuilder = inject(FormBuilder);
	mantForm: FormGroup;
	currentVehicleInfo: VehicleModel;
  serviceTypes: any[] = [
    { label: 'Oil Change', value: 'oil_change' },
    { label: 'Tire Rotation', value: 'tire_rotation' },
    // Otros tipos de servicio
  ];
  constructor(){

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

	}

  private initForm(): void {
    this.mantForm = this.formBuilder.group({
      date: [null],
      time: [null],
      odometer: [0],
      serviceType: [null],
      location: [null],
      amount: [null],
      files: [null],
      notes: ['']
    });
  }

  public onSubmit(): void {
		console.log('submit')
	}
}
