import { CommonModule } from '@angular/common';
import { Component, Input, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '@shared/base.component';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { AddVehicleButtonComponent } from '../add-vehicle-button/add-vehicle-button.component';

@Component({
	selector: 'app-vehicle-selector',
	standalone: true,
	imports: [CommonModule, DropdownModule, FormsModule, AddVehicleButtonComponent],
	templateUrl: './vehicle-selector.component.html'
})
export class VehicleSelectorComponent extends BaseComponent {
	selectedVehicle: string | undefined;
	@Input() disabled: boolean = false;

	constructor() {
		// Sincroniza la seleccion interna con la señal reactiva global de vehiculo seleccionado
		effect(() => {
			if (this.vehicleSvc.vehicleSelected()) {
				this.selectedVehicle = this.vehicleSvc.vehicleSelected().id;
			}
		});
		super();
	}

	/** Cambia el vehículo activo en la app recargando sus datos mediante la API local. */
	public switchVehicle(event: DropdownChangeEvent): void {
		this.spinnerSvc.show();
		this.vehicleSvc.getVehicleById(event.value).then(() => {
			this.spinnerSvc.hide();
		});
	}
}
