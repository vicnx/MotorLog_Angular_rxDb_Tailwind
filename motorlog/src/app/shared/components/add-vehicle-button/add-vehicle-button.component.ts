
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { Button } from 'primeng/button';

@Component({
	selector: 'app-add-vehicle-button',
	standalone: true,
	imports: [CommonModule, TranslateModule, Button],
	templateUrl: './add-vehicle-button.component.html'
})
export class AddVehicleButtonComponent extends BaseComponent {

  public goToAddVehicle() :void {
    this.routerSvc.navigate([CONSTANTS.routes.addVehicle])
  }
}
