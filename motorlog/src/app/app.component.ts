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

  vehiclesSvc = inject(VehiclesApiService)

  constructor(private translateService: TranslateService, private menuService: MenuService, private themeService: ThemeService, private messageService: MessageService){
    this.translateService.addLangs(['en', 'es']);
    this.translateService.setDefaultLang('en');
    const browserLang = this.translateService.getBrowserLang();
    this.translateService.use(browserLang?.match(/en|es/) ? browserLang : 'es');
  }

  public ngOnInit(): void {
    //TODO Check user logged
    this.menuService.checkEnableMenu();
    this.subscribesServices();
    this.vehiclesSvc.getAllBrands().subscribe({
      next: (res) =>
      console.log(res)
    })

  }

  private subscribesServices(): void {
    this.menuService.enableMenu$.subscribe((enableMenu)=> this.showMenu = enableMenu)
    // this.themeService.isDarkMode$.subscribe((darkMode)=> this.darkMode.set(darkMode))
  }

  // @HostBinding('class.dark') get mode() {
  //   return this.darkMode()
  // }


}
