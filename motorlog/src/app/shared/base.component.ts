import { Component } from '@angular/core';
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

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected translateService: TranslateService,
        protected utils: UtilsService,
        protected messageService: MessageService,
        public spinner: NgxSpinnerService
    ) {
        this.pageName = '';
    }

    public showNotImplemented(): void {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Funcionalidad no implementada.', key:'toast' });
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: msg, key:'toast' });
    }
}
