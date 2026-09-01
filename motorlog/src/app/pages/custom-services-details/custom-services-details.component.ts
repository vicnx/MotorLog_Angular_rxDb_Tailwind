import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { CustomService } from '@shared/models/custom-service.model';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-add-vehicle',
	standalone: true,
	imports: [
		CommonModule,
		TranslateModule,
		NgxSpinnerModule,
		FormsModule,
		ReactiveFormsModule,
		ColorPickerModule,
		PageHeaderComponent
	],
	templateUrl: './custom-services-details.component.html'
})
export class CustomServiceDetailsComponent extends BaseComponent implements OnInit {
	optionsIcons: string[] = [];
	formBuilder = inject(FormBuilder);
	customServiceForm: FormGroup;
	
	// Consulta
	isConsulta: boolean = false;
	customServiceData: CustomService;
	public ref = inject(DynamicDialogRef, { optional: true });

	ngOnInit(): void {
		this.routeSvc.data.subscribe((data) => {
			this.isConsulta = data['isConsulta'];
		});
		this.userSvc.page.update(
			(val) => (val = this.isConsulta ? 'pages.custom-services.edit_customService' : 'pages.custom-services.add_customService')
		);
		this.initForm();
	}

	public goBackToCustomServicesList(): void {
		this.routerSvc.navigate([CONSTANTS.routes.customServiceList]);
	}

	/**
	 * Selecciona un icono del grid táctil para el servicio personalizado.
	 */
	public selectIcon(iconName: string): void {
		if (this.isConsulta) {
			return;
		}
		this.customServiceForm.get('icon')?.setValue(iconName);
		this.customServiceForm.get('icon')?.markAsDirty();
		this.customServiceForm.get('icon')?.markAsTouched();
	}

	/**
	 * Abre el selector de color al pulsar sobre la fila.
	 */
	public override openColorPicker(colorPicker: any, event: Event): void {
		if (this.isConsulta) {
			return;
		}
		event.stopPropagation();
		if (colorPicker && typeof colorPicker.show === 'function') {
			colorPicker.show();
		}
	}

	private initForm(): void {
		this.vehicleSvc.getIcons().subscribe((data) => {
			this.optionsIcons = data;
		});

		this.customServiceForm = this.formBuilder.group({
			label: ['', [Validators.required]],
			color: ['#48d0b0'],
			icon: ['', [Validators.required]]
		});

		if (this.isConsulta) {
			this.routeSvc.params.subscribe((params) => {
				const id = params['id'];
				if (id) {
					const service = (this.userSvc.user().customServices || []).find((s: CustomService) => s.id === +id);
					if (service) {
						this.customServiceData = service;
						this.customServiceForm.patchValue({
							label: service.label,
							color: service.color || '#48d0b0',
							icon: service.icon
						});
					}
				}
			});
		}
	}

	public onSubmit(): void {
		if (this.customServiceForm.invalid) {
			this.customServiceForm.markAllAsTouched();
			return;
		}

		this.spinnerSvc.show();
		const val = this.customServiceForm.value;

		this.userSvc.addCustomServiceToUser(val).subscribe({
			next: (data) => {
				this.spinnerSvc.hide();
				if (this.ref) {
					this.ref.close(data);
				} else {
					this.goBackToCustomServicesList();
				}
			},
			error: () => this.spinnerSvc.hide()
		});
	}
}
