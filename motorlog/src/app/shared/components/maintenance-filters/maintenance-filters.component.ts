import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

export interface FilterDates {
	startDate: Date | null;
	endDate: Date | null;
}

@Component({
	selector: 'app-maintenance-filters',
	standalone: true,
	imports: [CommonModule, FormsModule, TranslateModule, ButtonModule, CalendarModule],
	templateUrl: './maintenance-filters.component.html',
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
export class MaintenanceFiltersComponent {
	@Output() onFiltersApplied = new EventEmitter<FilterDates>();

	startDate: Date | null = null;
	endDate: Date | null = null;
	filtersVisible: boolean = false;

	public toggleFilters(): void {
		this.filtersVisible = !this.filtersVisible;
	}

	public applyFilters(): void {
		this.onFiltersApplied.emit({ startDate: this.startDate, endDate: this.endDate });
	}

	public resetFilters(): void {
		this.startDate = null;
		this.endDate = null;
		this.applyFilters();
	}
}
