import { CommonModule } from '@angular/common';
import { Component, HostListener, effect, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '@shared/services/user.service';
import { CONSTANTS } from '@shared/app-constants';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [CommonModule, TranslateModule, RouterModule],
	templateUrl: './navbar.component.html'
})
export class NavbarComponent {
	avatar: string = '';
	isScrolled = false;
	isHomePage = false;

	userSvc = inject(UserService);
	router = inject(Router);

	constructor() {
		effect(() => {
			if (this.userSvc.user()) {
				this.avatar = this.userSvc.user().avatar;
			}
		});

		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(() => this.isHomePage = this.router.url.includes(CONSTANTS.routes.home));
		this.isHomePage = this.router.url.includes(CONSTANTS.routes.home);
	}

	/** Detecta scroll para añadir/quitar el contenedor pill */
	@HostListener('window:scroll')
	onScroll() {
		this.isScrolled = window.scrollY > 10;
	}

	goToAddMaintenance() {
		this.router.navigate([CONSTANTS.routes.addMaintenance]);
	}
}
