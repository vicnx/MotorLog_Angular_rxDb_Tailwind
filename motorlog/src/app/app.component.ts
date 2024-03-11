import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { MenuService } from '@shared/services/menu.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet, CommonModule,NgxSpinnerModule, NavbarComponent, TranslateModule],
    providers: [MenuService]
})
export class AppComponent implements OnInit {
  title = 'motorlog';
  showMenu = false;
  constructor(private translateService: TranslateService, private menuService: MenuService){
    // Configura los idiomas disponibles
    this.translateService.addLangs(['en', 'es']);

    // Establece el idioma por defecto
    this.translateService.setDefaultLang('en');
    const browserLang = this.translateService.getBrowserLang();
    this.translateService.use(browserLang?.match(/en|es/) ? browserLang : 'en');
  }

  public ngOnInit(): void {
    //TODO Check user logged
    this.menuService.checkEnableMenu();
    this.subscribesServices();
  }

  private subscribesServices(): void {
    this.menuService.enableMenu$.subscribe((enableMenu)=> this.showMenu = enableMenu)
  }
}
