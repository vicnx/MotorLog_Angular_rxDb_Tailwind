import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { UtilsService } from '@shared/services/utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
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

    constructor(
        protected override route: ActivatedRoute,
        protected override router: Router,
        protected translate: TranslateService,
        protected override utils: UtilsService,
        protected override messageService: MessageService,
        public override spinner: NgxSpinnerService
    ) {
        super(route, router, translate, utils, messageService, spinner);
        this.loginForm = new FormGroup({
            userName: new FormControl('', [Validators.required, Validators.maxLength(Number(CONSTANTS.form.inputText))])
        });
    }

    ngOnInit(): void {
        this.checkUser();
    }

    public checkErrors(): void {
      this.spinner.show();
        if (this.loginForm.invalid) {
            this.showErrorMsg(this.translate.instant('errors.MSGS.name'));
            this.spinner.hide();
            return;
        }
        this.registerUser();
    }

    public importData(): void {
        this.showNotImplemented();
    }

    private registerUser(): void {
      //TODO: registrar usuario.
      this.spinner.hide();
    }
}
