import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ActionRowComponent } from '@shared/components/action-row/action-row.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DevModeService } from '@shared/services/dev-mode.service';
import { UserService } from '@shared/services/user.service';
import { VehiclesService } from '@shared/services/vehicles.service';

@Component({
	selector: 'app-dev-mode-menu',
	standalone: true,
	imports: [CommonModule, TranslateModule, PageHeaderComponent, ActionRowComponent],
	templateUrl: './dev-mode-menu.component.html'
})
export class DevModeMenuComponent {
	@Output() back = new EventEmitter<void>();

	public devModeSvc = inject(DevModeService);
	public userSvc = inject(UserService);
	public vehicleSvc = inject(VehiclesService);

	/** Conteo reactivo total de mantenimientos en todos los vehículos */
	public totalMaintenancesCount = computed(() => {
		return this.vehicleSvc.vehicles().reduce((acc, v) => acc + (v.mantenimientos?.length || 0), 0);
	});

	public onBack(): void {
		this.back.emit();
	}

	public async populateVehicles(): Promise<void> {
		await this.devModeSvc.populateMockVehicles();
	}

	public async populateMaintenances(): Promise<void> {
		await this.devModeSvc.populateMockMaintenances();
	}

	public async clearMock(): Promise<void> {
		await this.devModeSvc.clearMockData();
	}

	public exitDevMode(): void {
		this.devModeSvc.exitDevMode();
	}
}
