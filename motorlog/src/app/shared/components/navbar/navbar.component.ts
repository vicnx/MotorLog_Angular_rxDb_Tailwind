import { CommonModule } from '@angular/common';
import { Component, HostListener, effect, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { UserService } from '@shared/services/user.service';
import { VehiclesService } from '@shared/services/vehicles.service';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [CommonModule, TranslateModule, RouterModule, SearchBarComponent],
	templateUrl: './navbar.component.html'
})
export class NavbarComponent {
	avatar: string = '';
	isScrolled = false;
	isHomePage = false;

	userSvc = inject(UserService);
	vehicleSvc = inject(VehiclesService);
	router = inject(Router);

	constructor() {
		effect(() => {
			if (this.userSvc.user()) {
				this.avatar = this.userSvc.user().avatar;
			}
		});

		this.router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe(() => {
				this.isHomePage = this.router.url.includes(CONSTANTS.routes.home);
				if (!this.isHomePage) {
					this.vehicleSvc.maintenanceSearchQuery.set('');
					this.vehicleSvc.isSearchOpen.set(false);
				}
			});
		this.isHomePage = this.router.url.includes(CONSTANTS.routes.home);
	}

	/** Detecta scroll para añadir/quitar el contenedor pill */
	@HostListener('window:scroll')
	onScroll(): void {
		this.isScrolled = window.scrollY > 10;
	}

	public onSearchQueryChange(query: string): void {
		this.vehicleSvc.maintenanceSearchQuery.set(query);
	}

	public onSearchOpenChange(isOpen: boolean): void {
		this.vehicleSvc.isSearchOpen.set(isOpen);
	}

	public goToAddMaintenance(): void {
		this.router.navigate([CONSTANTS.routes.addMaintenance]);
	}
}
