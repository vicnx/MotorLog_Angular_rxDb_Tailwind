import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@shared/base.component';
import { AddMaintenanceComponent } from '@shared/components/add-maintenance/add-maintenance.component';
import { VehicleSelectorComponent } from '@shared/components/vehicle-selector/vehicle-selector.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule, TranslateModule, NgxSpinnerModule, VehicleSelectorComponent, AddMaintenanceComponent],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {

	ngOnInit(): void {
	}
}
