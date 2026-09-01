import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavTabModel, MenuDataModel } from '@shared/models/menu.model';

@Component({
	selector: 'app-bottom-nav',
	standalone: true,
	imports: [CommonModule, RouterModule, TranslateModule],
	templateUrl: './bottom-nav.component.html',
	styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent implements OnInit {
	private http = inject(HttpClient);

	/** Pestañas del dock de navegación cargadas desde assets/data/menu.json */
	tabs: NavTabModel[] = [];

	ngOnInit(): void {
		this.loadMenu();
	}

	private loadMenu(): void {
		this.http.get<MenuDataModel>('assets/data/menu.json').subscribe({
			next: (data) => {
				this.tabs = data.menuItems;
			},
			error: (err) => {
				console.error('Error loading navigation menu:', err);
			}
		});
	}
}
