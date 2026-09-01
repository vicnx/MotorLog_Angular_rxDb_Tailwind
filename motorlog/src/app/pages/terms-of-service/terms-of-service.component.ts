import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CONSTANTS } from '@shared/app-constants';
import { UserService } from '@shared/services/user.service';

@Component({
	selector: 'app-terms-of-service',
	standalone: true,
	imports: [CommonModule, TranslateModule],
	templateUrl: './terms-of-service.component.html'
})
export class TermsOfServiceComponent implements OnInit {
	private location = inject(Location);
	private router = inject(Router);
	public userSvc = inject(UserService);
	public appConstants = CONSTANTS;

	ngOnInit(): void {
		this.userSvc.page.set('pages.terms.title');
	}

	// Regresa a la pantalla anterior o a la ruta por defecto según el estado de sesión
	public goBack(): void {
		if (window.history.length > 1) {
			this.location.back();
		} else {
			this.router.navigate([this.userSvc.isUserLogged() ? CONSTANTS.routes.home : CONSTANTS.routes.welcome]);
		}
	}
}
