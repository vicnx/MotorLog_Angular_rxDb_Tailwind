import { CommonModule } from '@angular/common';
import { Component, inject, Signal, effect } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { VehiclesService } from '@shared/services/vehicles.service';
import { VehicleModel } from '@shared/models/vehicle.model';
import { Maintenance } from '@shared/models/maintenance.model';
import { BaseComponent } from '@shared/base.component';
import { CONSTANTS } from '@shared/app-constants';

@Component({
	selector: 'app-maintenance-timeline',
	templateUrl: './maintenance-timeline.component.html',
	standalone: true,
	imports: [CommonModule, TimelineModule]
})
export class MaintenanceTimelineComponent extends BaseComponent {
	vehicleSelected: Signal<VehicleModel> = inject(VehiclesService).vehicleSelected;
	groupedMaintenances: any[] = [];

	constructor() {
		super();
		effect(() => {
			const vehicle = this.vehicleSelected();
			if (vehicle && vehicle.mantenimientos) {
				this.groupedMaintenances = this.groupAndSortMaintenances(vehicle.mantenimientos);
			}
		});
	}

	private groupAndSortMaintenances(maintenances: Maintenance[]): any[] {
		const grouped = maintenances.reduce((acc: any, maintenance: Maintenance) => {
			const date = new Date(maintenance.date);
			const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
			const serviceTypes = maintenance.serviceType || [];
			const defaultText = this.translateSvc.instant('pages.mant-details.add-mant.service-type.default');
			const firstServiceLabel = this.translateSvc.instant(serviceTypes[0]?.label?.toString()) || null;
			//prettier-ignore
			const serviceDescription = serviceTypes.length === 0 ? defaultText : firstServiceLabel + (serviceTypes.length > 1 ? ` +${serviceTypes.length - 1}` : '');
			const color = serviceTypes.length > 0 ? serviceTypes[0].color : 'text-gray-600';
			const updatedMaintenance = { ...maintenance, title: serviceDescription, color: color };
			if (!acc[monthYear]) {
				acc[monthYear] = [];
			}
			acc[monthYear].push(updatedMaintenance);
			return acc;
		}, {});

		//prettier-ignore
		return Object.keys(grouped).map((monthYear) => ({date: monthYear,maintenances: grouped[monthYear]})).sort((a: any, b: any) => {
				const dateA = new Date(grouped[a.date][0].date);
				const dateB = new Date(grouped[b.date][0].date);
				return dateB.getTime() - dateA.getTime();
		});
	}

	public goToEdit(maintenanceId: number): void {
		this.routerSvc.navigate([`${CONSTANTS.routes.maintenanceDetails}/${maintenanceId}`]);
	}
}
