import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, Signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { Maintenance, ServiceTypeItem } from '@shared/models/maintenance.model';
import { VehicleModel } from '@shared/models/vehicle.model';
import { VehiclesService } from '@shared/services/vehicles.service';
import { FilterDates } from '../maintenance-filters/maintenance-filters.component';

export interface GroupedMaintenanceItem {
	date: string;
	maintenances: (Maintenance & { title: string; color?: string })[];
}

@Component({
	selector: 'app-maintenance-timeline',
	templateUrl: './maintenance-timeline.component.html',
	standalone: true,
	imports: [
		CommonModule,
		TranslateModule
	],
	animations: [
		trigger('fadeInOut', [
			state(
				'void',
				style({
					opacity: 0,
					transform: 'scale(0.95)',
					height: 0,
					overflow: 'hidden'
				})
			),
			state(
				'*',
				style({
					opacity: 1,
					transform: 'scale(1)',
					height: '*'
				})
			),
			transition('void => *', [animate('300ms ease-out')]),
			transition('* => void', [animate('300ms ease-in')])
		])
	]
})
export class MaintenanceTimelineComponent extends BaseComponent {
	vehicleSelected: Signal<VehicleModel> = inject(VehiclesService).vehicleSelected;
	groupedMaintenances: GroupedMaintenanceItem[] = [];
	selectedMaintenanceId: number | string | null = null;

	startDate: Date | null = null;
	endDate: Date | null = null;

	constructor() {
		super();
		effect(() => {
			this.updateMaintenances();
		});
	}

	/** Filtra los mantenimientos dentro del rango de fechas activo (startDate - endDate). */
	private filterMaintenances(maintenances: Maintenance[]): Maintenance[] {
		if (!this.startDate && !this.endDate) {
			return maintenances;
		}
		const start = this.startDate ? new Date(this.startDate) : new Date('0001-01-01');
		const end = this.endDate ? new Date(this.endDate) : new Date('9999-12-31');

		end.setHours(23, 59, 59, 999);

		return maintenances.filter((maintenance) => {
			const maintenanceDate = new Date(maintenance.date);
			return maintenanceDate >= start && maintenanceDate <= end;
		});
	}

	/** Agrupa los mantenimientos por mes/año y los ordena cronológicamente de más reciente a más antiguo. */
	private groupAndSortMaintenances(maintenances: Maintenance[]): GroupedMaintenanceItem[] {
		const grouped = maintenances.reduce(
			(acc: Record<string, (Maintenance & { title: string; color?: string })[]>, maintenance: Maintenance) => {
				const date = new Date(maintenance.date);
				const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
				const serviceTypes: ServiceTypeItem[] = (maintenance.serviceType as ServiceTypeItem[]) || [];
				const defaultText = this.translateSvc.instant('pages.mant-details.add-mant.service-type.default');
				const firstServiceLabel = serviceTypes[0]?.label
					? this.translateSvc.instant(String(serviceTypes[0].label)) || null
					: null;
				const serviceDescription =
					serviceTypes.length === 0
						? defaultText
						: firstServiceLabel + (serviceTypes.length > 1 ? ` +${serviceTypes.length - 1}` : '');

				const color = serviceTypes.length > 0 ? serviceTypes[0].color || 'text-gray-600' : 'text-gray-600';
				const updatedMaintenance = { ...maintenance, title: serviceDescription, color: color };

				if (!acc[monthYear]) {
					acc[monthYear] = [];
				}
				acc[monthYear].push(updatedMaintenance);
				return acc;
			},
			{}
		);

		Object.keys(grouped).forEach((monthYear) => {
			grouped[monthYear].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
		});

		return Object.keys(grouped)
			.map((monthYear) => ({ date: monthYear, maintenances: grouped[monthYear] }))
			.sort((a, b) => {
				const dateA = new Date(grouped[a.date][0].date);
				const dateB = new Date(grouped[b.date][0].date);
				return dateB.getTime() - dateA.getTime();
			});
	}

	public toggleMaintenance(maintenanceId: number | string): void {
		this.selectedMaintenanceId = this.selectedMaintenanceId === maintenanceId ? null : maintenanceId;
	}

	public goToEdit(maintenanceId: number | string): void {
		this.routerSvc.navigate([`${CONSTANTS.routes.maintenanceDetails}/${maintenanceId}`]);
	}

	getIconClasses(mant: any): string[] {
		return [mant?.icon || 'fas fa-question-circle', 'text-xl'];
	}

	public updateMaintenances(): void {
		const vehicle = this.vehicleSelected();
		if (vehicle && vehicle.mantenimientos && vehicle.mantenimientos.length > 0) {
			const filteredMaintenances = this.filterMaintenances(vehicle.mantenimientos);
			this.groupedMaintenances = this.groupAndSortMaintenances(filteredMaintenances);
		} else {
			this.groupedMaintenances = [];
		}
	}

	public onFiltersChanged(dates: FilterDates): void {
		this.startDate = dates.startDate;
		this.endDate = dates.endDate;
		this.updateMaintenances();
	}
}
