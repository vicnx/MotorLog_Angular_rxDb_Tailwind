import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { AddVehicleButtonComponent } from '@shared/components/add-vehicle-button/add-vehicle-button.component';
import { VehicleModel } from '@shared/models/vehicle.model';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CapitalizeFirstPipe } from 'src/app/capitalize-first.pipe';
@Component({
	selector: 'app-vehicles-list',
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
		DataViewModule,
		CapitalizeFirstPipe,
    AddVehicleButtonComponent
	],
	templateUrl: './vehicles-list.component.html'
})
export class VehiclesListComponent extends BaseComponent implements OnInit {
	defaultImage: any = CONSTANTS.defaultImage;

	ngOnInit(): void {
		this.vehicleSvc.getSavedVehicles();
		this.vehicleSvc.loadVehicleBrands();
		this.userSvc.page.update((val) => (val = 'pages.vehicles-list.title'));
	}

	public getLogoBrand(brand: string): string {
		return this.vehicleSvc.vehiclesBrands().find((vehicle: any) => vehicle.code == brand)?.logo || this.defaultImage;
	}

	public onClickVehicle(vehicle: VehicleModel): void {
		this.routerSvc.navigate([`${CONSTANTS.routes.vehicleDetails}/${vehicle.id}`]);
	}
}
