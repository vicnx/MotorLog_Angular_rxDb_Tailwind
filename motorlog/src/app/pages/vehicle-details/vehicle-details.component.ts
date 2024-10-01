import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@shared/base.component';
import { ImageSelectorComponent } from '@shared/components/image-selector/image-selector.component';
import { VehicleModel } from '@shared/models/vehicle.model';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { VehiclesApiService } from 'src/app/api/vehicles_api.service';
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
		ColorPickerModule,
		InputNumberModule,
    ImageSelectorComponent
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
		this.userSvc.page.update((val) => (val = this.isConsulta ? 'pages.vehicle-details.title' : 'pages.add-vehicle.title'));
		this.initForm();
	}

	public onSubmit(): void {
		console.log(this.vehicleForm.value);
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
		this.vehicleSvc.updateVehicle(this.vehicleData.id, this.vehicleForm.value).subscribe({
			next: (res) => {
				this.operationOK();
			}
		});
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
			year: ['', [Validators.max(9999)]],
			color: ['#ff0000'],
			imagen: [null],
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

  get imageControl(): FormControl {
    return this.vehicleForm.get('imagen') as FormControl;
  }

	private loadIcons(): void {
		this.vehicleSvc.getIcons().subscribe({
			next: (resp) => {
				this.optionsIcons = resp.icons;
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
