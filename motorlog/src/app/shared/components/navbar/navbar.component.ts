import { CommonModule, Location } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuService } from '@shared/services/menu.service';
import { UtilsService } from '@shared/services/utils.service';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserService } from '@shared/services/user.service';
import { CONSTANTS } from '@shared/app-constants';
import { LangDropdownComponent } from '../lang-dropdown/lang-dropdown.component';
import { ButtonModule } from 'primeng/button';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [CommonModule, DropdownModule, FormsModule, TranslateModule, SidebarComponent, LangDropdownComponent, ButtonModule],
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
	menuOptions: any[] = [];
	langs: any[] | undefined;
	selectedLang: any | undefined;
	avatar: string = '';
	isHomePage = false;

	// Services
	utilsSvc = inject(UtilsService);
	translateSvc = inject(TranslateService);
	menuSvc = inject(MenuService);
	userSvc = inject(UserService);
	locationSvc = inject(Location);
	router = inject(Router);

	constructor() {
		effect(() => {
			if (this.userSvc.user()) {
				this.avatar = this.userSvc.user().avatar;
			}
            this.updateHomeCheck();
		});

        this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => this.updateHomeCheck());

	}

	toggleSidebar() {
		this.menuSvc.toogleMenu();
	}

	goBack() {
		this.locationSvc.back();
	}

    private updateHomeCheck() {
        const currentUrl = this.router.url;
        this.isHomePage = currentUrl.includes(CONSTANTS.routes.home);
      }

}
