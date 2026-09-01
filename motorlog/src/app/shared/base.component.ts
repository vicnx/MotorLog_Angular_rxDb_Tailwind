import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CONSTANTS } from './app-constants';
import { UtilsService } from './services/utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from './services/user.service';
import { FormGroup } from '@angular/forms';
import { VehiclesService } from './services/vehicles.service';

@Component({
	template: ''
})
export class BaseComponent {
	public const = CONSTANTS;

	// Servicios inyectados compartidos por todos los componentes
	routeSvc = inject(ActivatedRoute);
	utilsSvc = inject(UtilsService);
	translateSvc = inject(TranslateService);
	routerSvc = inject(Router);
	messageSvc = inject(MessageService);
	spinnerSvc = inject(NgxSpinnerService);
	userSvc = inject(UserService);
	vehicleSvc = inject(VehiclesService);
	confirmationSvc = inject(ConfirmationService);

	public showSuccess(): void {
		this.messageSvc.add({
			severity: 'success',
			summary: this.translateSvc.instant('msgs.success_header'),
			detail: this.translateSvc.instant('msgs.success'),
			key: 'toast'
		});
	}

	public showErrorMsg(msg: string): void {
		this.messageSvc.add({
			severity: 'error',
			summary: this.translateSvc.instant('msgs.error_header'),
			detail: msg,
			key: 'toast'
		});
	}

	protected markFieldsAsTouched(formGroup: FormGroup) {
		Object.values(formGroup.controls).forEach((control) => {
			control.markAsTouched();
			control.markAsDirty();
			if (control instanceof FormGroup) {
				this.markFieldsAsTouched(control);
			}
		});
	}

	/** Abre el panel de p-colorPicker de PrimeNG con fallback chain: show → toggle → click en preview. */
	public openColorPicker(colorPicker: any, event?: Event): void {
		if (event) {
			event.stopPropagation();
		}
		if (!colorPicker) return;
		if (typeof colorPicker.show === 'function') {
			colorPicker.show();
		} else if (typeof colorPicker.toggle === 'function') {
			colorPicker.toggle();
		} else if (colorPicker.el?.nativeElement) {
			const preview = colorPicker.el.nativeElement.querySelector('.p-colorpicker-preview') || colorPicker.el.nativeElement;
			preview?.click();
		}
	}
}

