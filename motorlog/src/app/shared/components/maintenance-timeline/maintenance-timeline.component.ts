import { CommonModule } from '@angular/common';
import { Component, inject, Signal, effect } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { VehiclesService } from '@shared/services/vehicles.service';
import { VehicleModel } from '@shared/models/vehicle.model';
import { Maintenance } from '@shared/models/maintenance.model';

@Component({
  selector: 'app-maintenance-timeline',
  templateUrl: './maintenance-timeline.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TimelineModule
  ],
})
export class MaintenanceTimelineComponent {
  vehicleSelected: Signal<VehicleModel> = inject(VehiclesService).vehicleSelected;
  groupedMaintenances: any[] = [];

  constructor(private vehicleSvc: VehiclesService) {
    effect(() => {
      const vehicle = this.vehicleSelected();
      if (vehicle && vehicle.mantenimientos) {
        this.groupedMaintenances = this.groupAndSortMaintenances(vehicle.mantenimientos);
      }
    });
  }

  groupAndSortMaintenances(maintenances: Maintenance[]): any[] {
    const grouped = maintenances.reduce((acc: any, maintenance: Maintenance) => {
      const date = new Date(maintenance.date);
      const monthYear = date.toLocaleDateString('default', { month: 'short', year: 'numeric' });
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(maintenance);
      return acc;
    }, {});

    return Object.keys(grouped).map(date => ({
      date,
      maintenances: grouped[date]
    })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'oil_change': return 'fas fa-oil-can'; // Font Awesome icon class for oil change
      case 'tire_change': return 'fas fa-tachometer-alt'; // Example icon class for tire change
      case 'brake_check': return 'fas fa-cogs'; // Example icon class for brake check
      // Add more cases as needed
      default: return 'fas fa-question-circle'; // Default icon class for unknown types
    }
  }
}
