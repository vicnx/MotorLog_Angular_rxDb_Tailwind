import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { Button } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { AddVehicleButtonComponent } from '../add-vehicle-button/add-vehicle-button.component';

@Component({
	selector: 'app-vehicle-selector',
	standalone: true,
	imports: [CommonModule, DropdownModule, FormsModule, TranslateModule, Button, AddVehicleButtonComponent],
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

  public goToAddVehicle() :void {
    this.routerSvc.navigate([CONSTANTS.routes.addVehicle])
  }
}
