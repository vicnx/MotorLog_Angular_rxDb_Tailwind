import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VehiclesService } from '@shared/services/vehicles.service';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';

@Component({
	selector: 'app-vehicle-selector',
	standalone: true,
	imports: [CommonModule, DropdownModule, FormsModule],
	templateUrl: './vehicle-selector.component.html'
})
export class VehicleSelectorComponent implements OnInit {
	vehicleSvc = inject(VehiclesService);
	selectedVehicle: any | undefined;

	ngOnInit(): void {
		this.vehicleSvc.getSavedVehicles();
    setTimeout(() => {
    console.log(this.vehicleSvc.vehicles())

    }, 1000);

  }

  public switchVehicle(event: DropdownChangeEvent): void {
    this.selectedVehicle = event.value;
	}
}
