import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { VehicleModel } from '@shared/models/vehicle.model';
import { CapitalizeFirstPipe } from '@shared/pipes/capitalize-first.pipe';

@Component({
	selector: 'app-vehicles-list',
	standalone: true,
	imports: [
		CommonModule,
		TranslateModule,
		CapitalizeFirstPipe
	],
	templateUrl: './vehicles-list.component.html'
})
export class VehiclesListComponent extends BaseComponent implements OnInit {
	ngOnInit(): void {
		this.vehicleSvc.getSavedVehicles();
		this.vehicleSvc.loadVehicleBrands();
		this.userSvc.page.update((val) => (val = 'pages.vehicles-list.title'));
	}

	public getLogoBrand(brandCode: string): string {
		return this.vehicleSvc.brandSvc.getLogoUrl(brandCode);
	}

	public onClickVehicle(vehicle: VehicleModel): void {
		this.routerSvc.navigate([`${CONSTANTS.routes.vehicleDetails}/${vehicle.id}`]);
	}

	public goToAddVehicle(): void {
		this.routerSvc.navigate([CONSTANTS.routes.addVehicle]);
	}
}
