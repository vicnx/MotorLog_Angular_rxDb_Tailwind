import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@shared/base.component';
import { MenuItemModel } from '@shared/models/menu.model';
import { MenuService } from '@shared/services/menu.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [CommonModule, SidebarModule, RouterModule, TranslateModule, ToastModule, AvatarModule, ButtonModule, ConfirmDialogModule],
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent extends BaseComponent {
	show: boolean;
	public pageSelected: string = '/home';
	public menuItems: MenuItemModel[] = [];
	public avatarImage: string;
	public profile: any = {};
	menuSvc = inject(MenuService);

	ngOnInit(): void {
		this.menuSvc.showMenu$.subscribe((open) => (this.show = open));
		this.routeControl();
		this.loadMenu();
		this.avatarImage = this.userSvc.user().avatar;
	}

	public openSettings(): void {
		this.showNotImplemented();
	}

	public logout(): void {
		this.userSvc.logoutUser();
		this.menuSvc.toogleMenu();
	}

	private routeControl(): void {
		this.pageSelected = window.location.hash.substr(1);
		this.routerSvc.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.pageSelected = event.url;
			}
		});
	}

	private loadMenu(): void {
		this.menuSvc.getMenuItems().subscribe({
			next: (resp) => {
				this.menuItems = resp.menuItems;
			}
		});
	}

	public hideSidebar(): void {
    console.log('hideSidebar')
		this.menuSvc.toogleMenu();
	}
}
