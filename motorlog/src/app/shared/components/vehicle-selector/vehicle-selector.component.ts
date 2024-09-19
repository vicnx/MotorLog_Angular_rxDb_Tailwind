import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '@shared/base.component';
import { VehiclesService } from '@shared/services/vehicles.service';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';

@Component({
	selector: 'app-vehicle-selector',
	standalone: true,
	imports: [CommonModule, DropdownModule, FormsModule],
	templateUrl: './vehicle-selector.component.html'
})
export class VehicleSelectorComponent extends BaseComponent implements OnInit {
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

	ngOnInit(): void {
		// setTimeout(() => {
		// 	// this.vehicleSvc.vehicleSelected.update((val) => (val = this.vehicleSvc.vehicles()[0]));
		// 	this.spinnerSvc.hide();
		// }, 500);
	}

  public switchVehicle(event: DropdownChangeEvent): void {
    this.spinnerSvc.show();
    this.vehicleSvc.getVehicleById(event.value).then(() => {
      this.spinnerSvc.hide();
    });
  }
}
