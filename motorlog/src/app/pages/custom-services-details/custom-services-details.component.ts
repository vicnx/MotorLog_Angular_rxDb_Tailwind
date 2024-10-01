import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@shared/base.component';
import { ImageSelectorComponent } from '@shared/components/image-selector/image-selector.component';
import { CustomService } from '@shared/models/custom-service.model';
import { VehicleModel } from '@shared/models/vehicle.model';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { VehiclesApiService } from 'src/app/api/vehicles_api.service';
@Component({
	selector: 'app-add-vehicle',
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
		InputNumberModule
	],
	templateUrl: './custom-services-details.component.html'
})
export class CustomServiceDetailsComponent extends BaseComponent implements OnInit {
	optionsIcons: string[] = [];
	formBuilder = inject(FormBuilder);
	customServiceForm: FormGroup;
	//Consulta
	isConsulta: boolean = false;
	customServiceData: CustomService;

	ngOnInit(): void {
		this.routeSvc.data.subscribe((data) => {
			this.isConsulta = data['isConsulta'];
		});
		this.userSvc.page.update((val) => (val = this.isConsulta ? 'pages.custom-services.edit_customService' : 'pages.custom-services.add_customService'));
		this.initForm();
	}

	public onSubmit(): void {
		console.log(this.customServiceForm.value);
		if (this.customServiceForm.valid) {
      this.newCustomService();
		} else {
			this.markFieldsAsTouched(this.customServiceForm);
		}
	}

  private newCustomService(): void {
		this.spinnerSvc.show();
    this.userSvc.addCustomServiceToUser(this.customServiceForm.value).subscribe({
      next: (res: any)=>{
        console.log(res)
		 		this.operationOK();
      }
    })
	}

	private operationOK(): void {
		this.showSuccess();
    this.spinnerSvc.hide();
		this.routerSvc.navigate([this.const.routes.customServiceList]);
	}

	private initForm(): void {
		this.customServiceForm = this.formBuilder.group({
			label: ['', Validators.required],
			value: ['', Validators.required],
			color: ['#ff0000'],
			icono: ['fa-car', Validators.required],
		});

    this.customServiceForm.get('label')?.valueChanges.subscribe((label: string) => {
      this.customServiceForm.patchValue({
        value: label.toLowerCase()
      });
    });
		this.loadIcons();
	}

	private loadIcons(): void {
		this.vehicleSvc.getIcons().subscribe({
			next: (resp) => {
				this.optionsIcons = resp.icons;
			}
		});
	}
}
