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
@Component({
	selector: 'app-add-vehicle',
	standalone: true,
	imports: [CommonModule, TranslateModule, NgxSpinnerModule, InputTextModule, DropdownModule, FormsModule,ReactiveFormsModule, ButtonModule, SelectButtonModule, ColorPickerModule ],
	templateUrl: './add-vehicle.component.html'
})
export class AddVehicleComponent extends BaseComponent implements OnInit {
  //FAKE INFO
  marcas = ['Marca 1', 'Marca 2', 'Marca 3'];
  modelos = ['Modelo 1', 'Modelo 2', 'Modelo 3'];
  iconos = ['fas fa-car', 'fas fa-truck', 'fas fa-motorcycle'];

  marcaSeleccionada: string;
  modeloSeleccionado: string;
  iconoSeleccionado: string;
	formBuilder = inject(FormBuilder);
  vehicleForm: FormGroup;
  vehicleSvc = inject(VehiclesService)
  vehiclesApiSvc = inject(VehiclesApiService)

	ngOnInit(): void {
    this.initForm();
	}

  onSubmit() {
    if (this.vehicleForm.valid) {
      console.log(this.vehicleForm.value);
    } else {
      this.marcarCamposComoTocados(this.vehicleForm);
    }
  }

  private marcarCamposComoTocados(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();

      if (control instanceof FormGroup) {
        this.marcarCamposComoTocados(control);
      }
    });
  }

  private initForm(): void {
    this.vehicleForm = this.formBuilder.group({
      nombreVehiculo: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      color: [''],
      imagen: [{ value: '', disabled: true }],
      cc: ['', [Validators.max(9999)]],
      cv: ['', [Validators.max(999)]],
      icono: ['', Validators.required],
      observaciones: ['', Validators.maxLength(200)]
    });
    	this.loadIcons();
      this.loadDropdowns()

  }

  private loadIcons(): void {
    this.vehicleSvc.getVehicleIcons().subscribe({
			next: (resp) => {
				this.iconos = resp.vehicle_icons;
			}
		});
  }

  private loadDropdowns(): void {
    this.vehiclesApiSvc.getAllBrands().subscribe({
      next: (resp)=>{
        this.marcas = resp.Results
      }
    })
  }
}
