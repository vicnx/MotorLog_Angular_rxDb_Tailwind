import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@shared/base.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DataViewModule } from 'primeng/dataview';
import { VehiclesService } from '@shared/services/vehicles.service';
import { CapitalizeFirstPipe } from 'src/app/capitalize-first.pipe';
import { CONSTANTS } from '@shared/app-constants';
import { VehicleModel } from '@shared/models/vehicle.model';
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
		CapitalizeFirstPipe
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
		this.routerSvc.navigate([`/vehicle-details/${vehicle.id}`]);
	}
}
