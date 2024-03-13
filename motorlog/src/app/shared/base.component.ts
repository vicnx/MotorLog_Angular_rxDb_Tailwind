import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { CONSTANTS } from './app-constants';
import { UserModel } from './models/user.model';
import { UtilsService } from './services/utils.service';
import { NgxSpinnerService } from 'ngx-spinner';

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

    constructor() {
        this.pageName = '';
    }

    public showNotImplemented(): void {
        this.messageSvc.add({ severity: 'error', summary: 'Error', detail: 'Funcionalidad no implementada.', key: 'toast' });
    }

    protected checkUser(): void {
        // this.dexieService.isLoggedIn$.subscribe((isLoggedIn) => {
        //     this.userIsLogged = this.dexieService.isLoggedIn;
        //     if (this.userIsLogged) {
        //         this.userData = this.dexieService.userDataInfo;
        //         this.router.navigate([CONSTANTS.routes.home]);
        //     } else {
        //         this.router.navigate([CONSTANTS.routes.welcome]);
        //     }
        // });
    }

    public showErrorMsg(msg: string): void {
        this.messageSvc.add({ severity: 'error', summary: 'Error', detail: msg, key: 'toast' });
    }
}
