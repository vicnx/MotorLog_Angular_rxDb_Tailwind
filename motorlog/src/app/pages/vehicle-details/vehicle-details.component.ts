import { CommonModule } from '@angular/common';
import { Component, OnInit, effect, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@shared/base.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputTextModule } from 'primeng/inputtext';
import { VehiclesService } from '@shared/services/vehicles.service';
import { VehiclesApiService } from 'src/app/api/vehicles_api.service';
import { MessageService } from 'primeng/api';
import { VehicleModel } from '@shared/models/vehicle.model';
@Component({
	selector: 'app-add-vehicle',
	standalone: true,
	imports: [
		CommonModule,
		TranslateModule,
		NgxSpinnerModule,
		InputTextModule,
		DropdownModule,
		FormsModule,
		ReactiveFormsModule,
		ButtonModule,
		SelectButtonModule,
		ColorPickerModule
	],
	templateUrl: './vehicle-details.component.html'
})
export class VehicleDetailsComponent extends BaseComponent implements OnInit {
	//FAKE INFO
	optionsBrands = [];
	// optionsModels = [];
	optionsIcons = [];

	formBuilder = inject(FormBuilder);
	vehicleForm: FormGroup;
	vehiclesApiSvc = inject(VehiclesApiService);

	//Consulta
	isConsulta: boolean = false;
	vehicleData: VehicleModel;


	ngOnInit(): void {
		this.routeSvc.data.subscribe((data) => {
			this.isConsulta = data['isConsulta'];
		});
    this.userSvc.page.update((val) => (val = this.isConsulta ? this.translateSvc.instant('pages.vehicle-details.title'): this.translateSvc.instant('pages.add-vehicle.title')) );
		this.initForm();
	}

	public onSubmit(): void {
		if (this.vehicleForm.valid) {
			if (this.isConsulta) {
				this.editVehicle();
			} else {
				this.newVehicle();
			}
		} else {
			this.markFieldsAsTouched(this.vehicleForm);
		}
	}

	private newVehicle(): void {
		this.vehicleSvc.addVehicle(this.vehicleForm.value).subscribe({
			next: (res) => {
				this.operationOK();
			}
		});
	}

	private editVehicle(): void {
    this.vehicleSvc.updateVehicle(this.vehicleData.id,this.vehicleForm.value).subscribe({
      next: (res) => {
        this.operationOK();
      }
    })
  }

	private operationOK(): void {
		this.showSuccess();
		this.vehicleSvc.getSavedVehicles();
		this.routerSvc.navigate([this.const.routes.vehiclesList]);
	}

	private initForm(): void {
		this.vehicleForm = this.formBuilder.group({
			nombreVehiculo: ['', Validators.required],
			marca: ['', Validators.required],
			modelo: ['', Validators.required],
			year: [''],
			color: ['#ff0000'],
			imagen: [{ value: '', disabled: true }],
			imagenMarca: [{ value: '', disabled: true }],
			cc: ['', [Validators.max(9999)]],
			cv: ['', [Validators.max(999)]],
			icono: ['', Validators.required],
			observaciones: ['', Validators.maxLength(200)]
		});

		if (this.isConsulta) {
			this.spinnerSvc.show();
			this.routeSvc.paramMap.subscribe((params) => {
				const vehicleId = params.get('id');
				if (vehicleId) {
					this.vehicleSvc.getVehicleById(vehicleId).then((vehicle: any) => {
						if (vehicle) {
							this.vehicleData = vehicle.toJSON();
							this.vehicleForm.patchValue(this.vehicleData);
						} else {
							this.routerSvc.navigate(['/vehicle-list']);
						}
						this.spinnerSvc.hide();
					});
				}
			});
		}
		this.loadIcons();
		this.loadDropdowns();
	}

	private loadIcons(): void {
		this.vehicleSvc.getVehicleIcons().subscribe({
			next: (resp) => {
				this.optionsIcons = resp.vehicle_icons;
			}
		});
	}

	private loadDropdowns(): void {
		this.vehicleSvc.getVehicleBrands().subscribe({
			next: (resp) => {
				this.optionsBrands = resp;
			}
		});
	}
}
