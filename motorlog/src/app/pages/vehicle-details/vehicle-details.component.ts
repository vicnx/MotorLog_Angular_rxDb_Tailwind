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
import { VehiclesApiService } from 'src/app/api/vehicles_api.service';
import { BrandLogoPipe } from "../../shared/pipes/brand-logo.pipe";
import { BrandService } from '@shared/services/brand.service';

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
		ColorPickerModule,
		InputNumberModule,
		ImageSelectorComponent,
		BrandLogoPipe
	],
	templateUrl: './vehicle-details.component.html'
})
export class VehicleDetailsComponent extends BaseComponent implements OnInit {
	optionsBrands: any[] = [];
	optionsIcons: any[] = [];

	formBuilder = inject(FormBuilder);
	vehicleForm: FormGroup;
	vehiclesApiSvc = inject(VehiclesApiService);
	brandSvc = inject(BrandService);

	// Estado de consulta o edición
	isConsulta: boolean = false;
	isEditing: boolean = false;
	vehicleData: VehicleModel;

	ngOnInit(): void {
		this.routeSvc.data.subscribe((data) => {
			this.isConsulta = data['isConsulta'];
		});
		this.userSvc.page.update((val) => (val = this.isConsulta ? 'pages.vehicle-details.title' : 'pages.add-vehicle.title'));
		this.initForm();
	}

	/**
	 * Activa el modo de edición habilitando la modificación de todos los campos.
	 */
	public enableEdit(): void {
		this.isConsulta = false;
		this.isEditing = true;
		this.vehicleForm.enable();
	}

	/**
	 * Cancela la edición, restablece los datos originales y bloquea el formulario.
	 */
	public cancelEdit(): void {
		this.isConsulta = true;
		this.isEditing = false;
		if (this.vehicleData) {
			this.vehicleForm.patchValue(this.vehicleData);
		}
		this.vehicleForm.disable();
	}

	/**
	 * Selecciona un icono del grid táctil únicamente en modo edición/alta.
	 */
	public selectIcon(iconName: string): void {
		if (this.isConsulta || this.vehicleForm.disabled) {
			return;
		}
		this.vehicleForm.get('icono')?.setValue(iconName);
		this.vehicleForm.get('icono')?.markAsTouched();
	}

	public onSubmit(): void {
		if (this.isConsulta) {
			return;
		}
		if (this.vehicleForm.valid) {
			if (this.vehicleData && this.vehicleData.id) {
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
			next: () => {
				this.operationOK();
			}
		});
	}

	private editVehicle(): void {
		this.vehicleSvc.updateVehicle(this.vehicleData.id, this.vehicleForm.value).subscribe({
			next: () => {
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
					this.vehicleSvc.getVehicleById(vehicleId).then((vehicle) => {
						if (vehicle) {
							this.vehicleData = (vehicle as any).toJSON ? (vehicle as any).toJSON() : vehicle;
							this.vehicleForm.patchValue(this.vehicleData);
							this.vehicleForm.disable();
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
				this.optionsIcons = resp.icons || [];
			}
		});
	}

	private loadDropdowns(): void {
		this.vehicleSvc.getVehicleBrands().subscribe({
			next: (resp) => {
				this.optionsBrands = resp;
				this.brandSvc.setBrands(resp);
			}
		});
	}
}
