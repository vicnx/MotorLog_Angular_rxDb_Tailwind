import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuService } from '@shared/services/menu.service';
import { UtilsService } from '@shared/services/utils.service';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserService } from '@shared/services/user.service';
import { CONSTANTS } from '@shared/app-constants';

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
    userSvc = inject(UserService);
    constructor() {}

    public avatarImage: string;

    ngOnInit() {
        this.avatarImage = this.userSvc.user().avatar || CONSTANTS.user.default.avatar;
    }

    private initUi(): void {}

    toggleSidebar() {
        this.menuSvc.toogleMenu();
    }
}
