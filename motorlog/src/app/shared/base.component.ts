import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CONSTANTS } from './app-constants';
import { UserModel } from './models/user.model';
import { UtilsService } from './services/utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from './services/user.service';
import { FormGroup } from '@angular/forms';
import { VehiclesService } from './services/vehicles.service';

@Component({
	template: ''
})
export class BaseComponent {
	public pageName: string = '';
	public userIsLogged: boolean = false;
	public const = CONSTANTS;
	public userData: UserModel = {} as UserModel;

	// Services
	routeSvc = inject(ActivatedRoute);
	utilsSvc = inject(UtilsService);
	translateSvc = inject(TranslateService);
	routerSvc = inject(Router);
	messageSvc = inject(MessageService);
	spinnerSvc = inject(NgxSpinnerService);
	userSvc = inject(UserService);
	vehicleSvc = inject(VehiclesService);
	confirmationSvc = inject(ConfirmationService);

	constructor() {
		this.pageName = '';
	}

	public showNotImplemented(): void {
		this.messageSvc.add({
			severity: 'error',
			summary: this.translateSvc.instant('msgs.error_header'),
			detail: this.translateSvc.instant('msgs.not_implemented'),
			key: 'toast'
		});
	}

	public showSuccess(): void {
		this.messageSvc.add({
			severity: 'success',
			summary: this.translateSvc.instant('msgs.success_header'),
			detail: this.translateSvc.instant('msgs.success'),
			key: 'toast'
		});
	}

	protected checkUser(): void {}

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
}
