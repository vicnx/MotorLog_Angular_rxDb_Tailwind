import { CommonModule } from '@angular/common';
import { Component, OnInit, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { MenuService } from '@shared/services/menu.service';
import { ThemeService } from '@shared/services/theme.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { VehiclesApiService } from './api/vehicles_api.service';
import { DBService } from '@shared/services/db.service';
import { UserService } from '@shared/services/user.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { VehiclesService } from '@shared/services/vehicles.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: true,
	imports: [RouterOutlet, CommonModule, NgxSpinnerModule, NavbarComponent, TranslateModule, ThemeToggleComponent, ToastModule, ConfirmDialogModule],
	providers: [MenuService, ThemeService, MessageService, UserService, DBService, ConfirmationService, MessageService, VehiclesService, VehiclesApiService]
})
export class AppComponent implements OnInit {
	title = 'motorlog';
	// darkMode = signal<boolean>(false)

	// Services
	vehiclesApiSvc = inject(VehiclesApiService);
	translateSvc = inject(TranslateService);
	menuSvc = inject(MenuService);
	userSvc = inject(UserService);
	vehiclesSvc = inject(VehiclesService);

	constructor() {
		this.translateSvc.addLangs(['en', 'es']);
		this.translateSvc.setDefaultLang('en');
		const browserLang = this.translateSvc.getBrowserLang();
		this.translateSvc.use(browserLang?.match(/en|es/) ? browserLang : 'es');
    this.vehiclesSvc.getSavedVehicles();

	}

	public ngOnInit(): void {
    this.userSvc.checkUserExistsDb();
	}

	// @HostBinding('class.dark') get mode() {
	//   return this.darkMode()
	// }
}
