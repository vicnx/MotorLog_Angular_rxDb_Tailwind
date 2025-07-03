import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { Maintenance } from '@shared/models/maintenance.model';
import { VehicleModel } from '@shared/models/vehicle.model';
import { VehiclesService } from '@shared/services/vehicles.service';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { TimelineModule } from 'primeng/timeline';

@Component({
	selector: 'app-maintenance-timeline',
	templateUrl: './maintenance-timeline.component.html',
	standalone: true,
	imports: [CommonModule, TimelineModule, TranslateModule, ButtonModule, CalendarModule, FormsModule],
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
	groupedMaintenances: any[] = [];
	selectedMaintenanceId: number | null = null;

	startDate: Date | null = null;
	endDate: Date | null = null;
	filtersVisible: boolean = false;
	es = {
		firstDayOfWeek: 1,
		dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
		dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
		monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
		monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
		today: 'Hoy'
	};
	constructor() {
		super();
		effect(() => {
			this.updateMaintenances();
		});
	}

	private filterMaintenances(maintenances: Maintenance[]): Maintenance[] {
		if (!this.startDate && !this.endDate) {
			return maintenances;
		}
		const start = this.startDate ? new Date(this.startDate) : new Date('0001-01-01');
		const end = this.endDate ? new Date(this.endDate) : new Date('9999-12-31');

		// Ajustar el final del rango para incluir todo el día
		end.setHours(23, 59, 59, 999);

		return maintenances.filter((maintenance) => {
			const maintenanceDate = new Date(maintenance.date);
			return maintenanceDate >= start && maintenanceDate <= end;
		});
	}

	private groupAndSortMaintenances(maintenances: Maintenance[]): any[] {
		const grouped = maintenances.reduce((acc: any, maintenance: Maintenance) => {
			const date = new Date(maintenance.date);
			const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
			const serviceTypes = maintenance.serviceType || [];
			const defaultText = this.translateSvc.instant('pages.mant-details.add-mant.service-type.default');
			const firstServiceLabel = serviceTypes[0] ? this.translateSvc.instant(serviceTypes[0]?.label?.toString()) || null : null;
			const serviceDescription =
				serviceTypes.length === 0 ? defaultText : firstServiceLabel + (serviceTypes.length > 1 ? ` +${serviceTypes.length - 1}` : '');

			const color = serviceTypes.length > 0 ? serviceTypes[0].color : 'text-gray-600';
			const updatedMaintenance = { ...maintenance, title: serviceDescription, color: color };

			if (!acc[monthYear]) {
				acc[monthYear] = [];
			}
			acc[monthYear].push(updatedMaintenance);
			return acc;
		}, {});

		Object.keys(grouped).forEach((monthYear) => {
			grouped[monthYear].sort((a: Maintenance, b: Maintenance) => {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			});
		});

		//prettier-ignore
		return Object.keys(grouped).map((monthYear) => ({ date: monthYear, maintenances: grouped[monthYear]})).sort((a: any, b: any) => {
				const dateA = new Date(grouped[a.date][0].date);
				const dateB = new Date(grouped[b.date][0].date);
				return dateB.getTime() - dateA.getTime();
		});
	}

	public toggleMaintenance(maintenanceId: number): void {
		this.selectedMaintenanceId = this.selectedMaintenanceId === maintenanceId ? null : maintenanceId;
	}

	public goToEdit(maintenanceId: number): void {
		this.routerSvc.navigate([`${CONSTANTS.routes.maintenanceDetails}/${maintenanceId}`]);
	}

	getIconClasses(mant: any) {
		return [mant.icon || 'fas fa-question-circle', 'text-xl'];
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

	public resetFilters(): void {
		this.startDate = null;
		this.endDate = null;
		this.updateMaintenances(); // Actualizar la lista de mantenimientos sin filtros
	}

	toggleFilters(): void {
		this.filtersVisible = !this.filtersVisible;
	}

	public goToAddMaintenance(): void {
		this.routerSvc.navigate([CONSTANTS.routes.addMaintenance]);
	}
}
