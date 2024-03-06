import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '@shared/services/menu.service';
import { Observable } from 'rxjs';
import { SidebarModule } from 'primeng/sidebar';


@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, SidebarModule ],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    show: boolean;

    constructor(private menuService: MenuService) {}

    ngOnInit(): void {
        this.menuService.showMenu$.subscribe((open) => (this.show = open));
    }

    hideSidebar() : void {
      this.menuService.toogleMenu();
    }
}
