import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuService } from '@shared/services/menu.service';
import { UtilsService } from '@shared/services/utils.service';
import { DropdownModule } from 'primeng/dropdown';
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

    // Services
    utilsSvc = inject(UtilsService);
    translateSvc = inject(TranslateService);
    menuSvc = inject(MenuService);
    constructor() {}

    public avatarImage: string;

    ngOnInit() {
        this.avatarImage = this.utilsSvc.generateAvatar('random');
        this.langs = [
            { label: 'Español', icon: 'fi fi-es', value: 'es' },
            { label: 'Inglés', icon: 'fi fi-gb', value: 'en' }
        ];
        this.selectedLang = this.langs[0];
        this.translateSvc.onLangChange.subscribe(() => {
            this.menuOptions = [
                { label: this.translateSvc.instant('pages.home.title'), link: '#' },
                { label: 'About', link: '#' },
                { label: 'Services', link: '#' },
                { label: 'Pricing', link: '#' },
                { label: 'Contact', link: '#' }
            ];
        });
    }

    private initUi(): void {}

    toggleSidebar() {
        this.menuSvc.toogleMenu();
    }
}
