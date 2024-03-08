import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { UtilsService } from '@shared/services/utils.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';



@Component({
    selector: 'welcome-page',
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule, InputTextModule, ButtonModule],
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent extends BaseComponent implements OnInit {
    public userName: string = CONSTANTS.user.default.name;
    constructor(
        protected override route: ActivatedRoute,
        protected override router: Router,
        protected override translateService: TranslateService,
        protected override utils: UtilsService
    ) {
        super(route, router, translateService, utils);
    }

    ngOnInit(): void {
        this.checkUser();
        this.userName = 'Paco';
    }

    public login(): void {

    }
}
