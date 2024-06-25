import { Component } from '@angular/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-maintenance',
  standalone: true,
	imports: [
		ButtonModule
	],
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.scss']
})
export class AddMaintenanceComponent extends BaseComponent {

  navigate() {
    this.routerSvc.navigate([CONSTANTS.routes.addMaintenance]);
  }
}
