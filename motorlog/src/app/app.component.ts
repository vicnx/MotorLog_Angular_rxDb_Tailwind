import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { MenuService } from '@shared/services/menu.service';
import { ThemeService } from '@shared/services/theme.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { VehiclesApiService } from './api/vehicles_api.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet, CommonModule,NgxSpinnerModule, NavbarComponent, TranslateModule, ThemeToggleComponent, ToastModule],
    providers: [MenuService, ThemeService, MessageService]
})
export class AppComponent implements OnInit {
  title = 'motorlog';
  showMenu = false;
  // darkMode = signal<boolean>(false)

  // Services
  vehiclesSvc = inject(VehiclesApiService)
  translateSvc = inject(TranslateService);
  menuSvc= inject(MenuService);

  constructor(){
    this.translateSvc.addLangs(['en', 'es']);
    this.translateSvc.setDefaultLang('en');
    const browserLang = this.translateSvc.getBrowserLang();
    this.translateSvc.use(browserLang?.match(/en|es/) ? browserLang : 'es');
  }

  public ngOnInit(): void {
    //TODO Check user logged
    this.menuSvc.checkEnableMenu();
    this.subscribesServices();
    this.vehiclesSvc.getAllBrands().subscribe({
      next: (res) =>
      console.log(res)
    })
  }

  private subscribesServices(): void {
    this.menuSvc.enableMenu$.subscribe((enableMenu)=> this.showMenu = enableMenu)
    // this.themeService.isDarkMode$.subscribe((darkMode)=> this.darkMode.set(darkMode))
  }

  // @HostBinding('class.dark') get mode() {
  //   return this.darkMode()
  // }


}
