import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BackupDialogMsgComponent } from '@shared/components/backup-dialog-msg/backup-dialog-msg.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { ScrollTopComponent } from '@shared/components/scroll-top/scroll-top.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { WelcomeDialogInfoComponent } from '@shared/components/welcome-dialog-info/welcome-dialog-info.component';
import { DataExportImportService } from '@shared/services/dataExportImport.service';
import { DBService } from '@shared/services/db.service';
import { MenuService } from '@shared/services/menu.service';
import { ThemeService } from '@shared/services/theme.service';
import { UserService } from '@shared/services/user.service';
import { VehiclesService } from '@shared/services/vehicles.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { VehiclesApiService } from './api/vehicles_api.service';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: true,
	imports: [
		RouterOutlet,
		CommonModule,
		NgxSpinnerModule,
		NavbarComponent,
		TranslateModule,
		ThemeToggleComponent,
		ToastModule,
		ConfirmDialogModule,
		WelcomeDialogInfoComponent,
		ScrollTopComponent,
		BackupDialogMsgComponent
	],
	providers: [
		MenuService,
		ThemeService,
		MessageService,
		UserService,
		DBService,
		ConfirmationService,
		MessageService,
		VehiclesService,
		VehiclesApiService,
		DataExportImportService
	]
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
  primeNgConfig = inject(PrimeNGConfig);

	constructor() {
		registerLocaleData(localeEs, 'es-ES');
		this.translateSvc.addLangs(['en', 'es']);
		this.translateSvc.setDefaultLang('es');
		const browserLang = this.translateSvc.getBrowserLang();
		this.translateSvc.use(browserLang?.match(/en|es/) ? browserLang : 'es');
		this.translateSvc.get('primeng').subscribe(res => {
			this.primeNgConfig.setTranslation(res);
		});
		this.vehiclesSvc.getSavedVehicles();
	}

	public ngOnInit(): void {
		this.userSvc.checkUserExistsDb();
	}

	// @HostBinding('class.dark') get mode() {
	//   return this.darkMode()
	// }
}
