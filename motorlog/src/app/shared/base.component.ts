import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CONSTANTS } from './app-constants';
import { UtilsService } from './services/utils.service';
import { UserModel } from './models/user.model';

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
        protected utils: UtilsService
    ) {
        this.pageName = '';
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
}
