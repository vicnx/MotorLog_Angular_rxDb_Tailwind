import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class AppComponent {
  title = 'motorlog';
  constructor(private translateService: TranslateService){
    // Configura los idiomas disponibles
    this.translateService.addLangs(['en', 'es']);

    // Establece el idioma por defecto
    this.translateService.setDefaultLang('en');
    const browserLang = this.translateService.getBrowserLang();
    this.translateService.use(browserLang?.match(/en|es/) ? browserLang : 'en');
  }
}
