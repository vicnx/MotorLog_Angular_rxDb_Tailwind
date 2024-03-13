import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
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
    public loginForm: FormGroup; // Definir FormGroup

    constructor() {
        super();
        this.loginForm = new FormGroup({
            userName: new FormControl('', [Validators.required, Validators.maxLength(Number(CONSTANTS.form.inputText))])
        });
    }

    ngOnInit(): void {
        this.checkUser();
    }

    public checkErrors(): void {
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
        //TODO: registrar usuario.
        this.spinnerSvc.hide();
    }
}
