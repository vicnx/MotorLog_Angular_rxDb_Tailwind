import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@shared/base.component';
import { MaintenanceTimelineComponent } from '@shared/components/maintenance-timeline/maintenance-timeline.component';
import { VehicleSelectorComponent } from '@shared/components/vehicle-selector/vehicle-selector.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule, TranslateModule, NgxSpinnerModule, VehicleSelectorComponent, MaintenanceTimelineComponent],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {

	ngOnInit(): void {
		this.userSvc.page.update((val) => (val = 'pages.home.title'));
	}
}
