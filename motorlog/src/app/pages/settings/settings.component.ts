import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { ActionRowComponent } from '@shared/components/action-row/action-row.component';
import { LangDropdownComponent } from '@shared/components/lang-dropdown/lang-dropdown.component';
import { DataManagementComponent } from './components/data-management/data-management.component';

export type SettingsView = 'main' | 'data';

@Component({
	selector: 'app-settings',
	standalone: true,
	templateUrl: './settings.component.html',
	imports: [
		CommonModule,
		TranslateModule,
		ActionRowComponent,
		LangDropdownComponent,
		DataManagementComponent
	]
})
export class SettingsComponent extends BaseComponent implements OnInit {
	currentView: SettingsView = 'main';

	ngOnInit(): void {
		this.userSvc.page.set('pages.settings.settings');
	}

	public goToDataManagement(): void {
		this.currentView = 'data';
	}

	public backToMainSettings(): void {
		this.currentView = 'main';
	}

	public goToProfile(): void {
		this.routerSvc.navigate([CONSTANTS.routes.profile]);
	}

	public openPrivacy(): void {
		window.open('privacy-policy.html', '_blank');
	}

	public openTerms(): void {
		window.open('terms-of-service.html', '_blank');
	}
}
