import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { UserService } from '@shared/services/user.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

@Component({
	selector: 'welcome-page',
	standalone: true,
	imports: [CommonModule, TranslateModule, ReactiveFormsModule, InputTextModule, ButtonModule, ToastModule],
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent extends BaseComponent implements OnInit {
	public welcomeImg: string = './../../../../../assets//images/welcome.svg';
	public loginForm: FormGroup;
	constructor() {
		super();
		this.loginForm = new FormGroup({
			userName: new FormControl('', [Validators.required, Validators.maxLength(Number(CONSTANTS.form.inputText))])
		});
		effect(() => {
			if (this.userSvc.userExistOnBd()) {
				this.userSvc.checkUserExistsDb();
			}
			if (this.userSvc.isUserLogged()) {
				this.routerSvc.navigate([this.const.routes.home]);
			}
		});
	}

	ngOnInit(): void {
		this.checkUser();
	}

	public checkErrors(): void {
		if (this.userSvc.userExistOnBd() && !this.userSvc.isUserLogged()) {
			this.userSvc.setLogginUser(true);
			this.spinnerSvc.hide();
			return;
		}
		this.spinnerSvc.show();
		if (this.loginForm.invalid) {
			this.showErrorMsg(this.translateSvc.instant('errors.MSGS.name'));
			this.spinnerSvc.hide();
			return;
		}
		this.registerUser();
	}

	public importData(): void {
		this.showNotImplemented();
	}

	private registerUser(): void {
		if (!this.userSvc.userExistOnBd()) {
			this.userSvc.setUser(this.loginForm.get('userName')?.value);
			this.spinnerSvc.hide();
		}
	}
}
