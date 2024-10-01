import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { CustomService } from '@shared/models/custom-service.model';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CapitalizeFirstPipe } from 'src/app/capitalize-first.pipe';

@Component({
	selector: 'app-custom-services-list',
	templateUrl: './custom-services-list.component.html',
	standalone: true,
	imports: [
		CommonModule,
		TranslateModule,
		NgxSpinnerModule,
		InputTextModule,
		DropdownModule,
		FormsModule,
		ReactiveFormsModule,
		ButtonModule,
		SelectButtonModule,
		ColorPickerModule,
		DataViewModule,
		CapitalizeFirstPipe,
    ButtonModule
	],
})
export class CustomServicesListComponent extends BaseComponent implements OnInit {

	ngOnInit() {
		this.userSvc.page.update((val) => (val = 'pages.custom-services.title'));
  }

  public goToAddCustomService() :void {
    this.routerSvc.navigate([CONSTANTS.routes.customServiceAdd])
  }

  public removeCustomService(customService: any): void {
    this.confirmationSvc.confirm({
			message: this.translateSvc.instant('pages.custom-services.delete_customService.confirm_msg'),
			header: this.translateSvc.instant('pages.custom-services.delete_customService.confirm_header'),
			icon: 'fas fa-exclamation-triangle',
			rejectButtonStyleClass: 'p-button-text',
			acceptLabel: this.translateSvc.instant('confirm.default_yes'),
			rejectLabel: this.translateSvc.instant('confirm.default_no'),
			key: 'confirmDialog',
			accept: () => {
				this.spinnerSvc.show();
        this.userSvc.removeCustomServiceFromUser(customService.id).subscribe({
          next: (res) => {
				    this.spinnerSvc.hide();
            console.log(res)
          }
        })
			},
			reject: () => {}
		});
  }

}
