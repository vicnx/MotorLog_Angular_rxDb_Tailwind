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
	selectedVehicle: any | undefined;
	@Input() disabled: boolean = false;

	constructor() {
		effect(() => {
			if (this.vehicleSvc.vehicleSelected()) {
				this.selectedVehicle = this.vehicleSvc.vehicleSelected().id;
			}
		});
		super();
	}

	public switchVehicle(event: DropdownChangeEvent): void {
		this.spinnerSvc.show();
		this.vehicleSvc.getVehicleById(event.value).then(() => {
			this.spinnerSvc.hide();
		});
	}
}
