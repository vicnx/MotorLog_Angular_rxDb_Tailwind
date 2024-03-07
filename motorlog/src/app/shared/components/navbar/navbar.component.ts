import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '@shared/services/utils.service';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuService } from '@shared/services/menu.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, DropdownModule, FormsModule, TranslateModule, SidebarComponent],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    menuOptions: any[] = [];
    langs: any[] | undefined;

    selectedLang: any | undefined;
    constructor(private utils: UtilsService, private translateService: TranslateService, private menuService: MenuService) {
    }

    public avatarImage: string;

    ngOnInit() {

        this.avatarImage = this.utils.generateAvatar('random');
        this.langs = [
            { label: 'Español', icon: 'fi fi-es', value: 'es' },
            { label: 'Inglés', icon: 'fi fi-gb', value: 'en' }
        ];
        this.selectedLang = this.langs[0];
        this.translateService.onLangChange.subscribe(() => {
          this.menuOptions = [
            { label: this.translateService.instant('pages.home.title'), link: '#' },
            { label: 'About', link: '#' },
            { label: 'Services', link: '#' },
            { label: 'Pricing', link: '#' },
            { label: 'Contact', link: '#' }
        ];
      });

    }

    private initUi():void {

    }

    toggleSidebar() {
      this.menuService.toogleMenu();
    }
}
