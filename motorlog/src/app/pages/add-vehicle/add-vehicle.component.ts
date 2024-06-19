import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
	templateUrl: './add-vehicle.component.html'
})
export class AddVehicleComponent extends BaseComponent implements OnInit {
	//FAKE INFO
	optionsBrands = [];
	// optionsModels = [];
	optionsIcons = [];

	formBuilder = inject(FormBuilder);
	vehicleForm: FormGroup;
	vehicleSvc = inject(VehiclesService);
	vehiclesApiSvc = inject(VehiclesApiService);

	ngOnInit(): void {
		this.initForm();
	}

	public onSubmit(): void {
		if (this.vehicleForm.valid) {
			this.vehicleSvc.addVehicle(this.vehicleForm.value).subscribe({
				next: (res) => {
					this.showSuccess();
          this.vehicleSvc.getSavedVehicles();
					this.routerSvc.navigate([this.const.routes.home]);
				}
			});
		} else {
			this.markFieldsAsTouched(this.vehicleForm);
		}
	}

	private initForm(): void {
		this.vehicleForm = this.formBuilder.group({
			nombreVehiculo: ['', Validators.required],
			marca: ['', Validators.required],
			modelo: ['', Validators.required],
			color: [''],
			imagen: [{ value: '', disabled: true }],
			imagenMarca: [{ value: '', disabled: true }],
			cc: ['', [Validators.max(9999)]],
			cv: ['', [Validators.max(999)]],
			icono: ['', Validators.required],
			observaciones: ['', Validators.maxLength(200)]
		});
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
