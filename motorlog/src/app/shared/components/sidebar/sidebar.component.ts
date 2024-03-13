import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { MenuItemModel } from '@shared/models/menu.model';
import { MenuService } from '@shared/services/menu.service';
import { UtilsService } from '@shared/services/utils.service';
import { SidebarModule } from 'primeng/sidebar';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, SidebarModule, RouterModule, TranslateModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    show: boolean;
    public pageSelected: string = '/home';
    public const = CONSTANTS;
    public menuItems: MenuItemModel[] = [];
    public avatarImage: string;
    public profile: any = {};

    routeSvc= inject(ActivatedRoute);
    utilsSvc= inject(UtilsService);
    translateSvc= inject(TranslateService);
    routerSvc= inject(Router);
    menuSvc = inject(MenuService)

    constructor() {}

    ngOnInit(): void {
        this.menuSvc.showMenu$.subscribe((open) => (this.show = open));
        this.routeControl();
        this.loadMenu();
        this.avatarImage = this.profile.avatar || this.utilsSvc.generateAvatar('random');
    }

    private routeControl(): void {
        this.pageSelected = window.location.hash.substr(1);
        this.routerSvc.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.pageSelected = event.url;
            }
        });

        //TODO: Recuperar si hay usuario login. obtener tambien su información.
        // this.dexieService.isLoggedIn$.subscribe((isLoggedIn) => {
        //     this.showMenu = isLoggedIn;
        // });
    }

    private loadMenu(): void {
        this.menuSvc.getMenuItems().subscribe({
            next: (resp) => {
                this.menuItems = resp.menuItems;
            }
        });
    }

    public hideSidebar(): void {
        this.menuSvc.toogleMenu();
    }
}
