import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { ActivatedRoute, Params } from '@angular/router';
import { ActionRowComponent } from '@shared/components/action-row/action-row.component';
import { LangDropdownComponent } from '@shared/components/lang-dropdown/lang-dropdown.component';
import { DataManagementComponent } from './components/data-management/data-management.component';
import { DevModeMenuComponent } from './components/dev-mode-menu/dev-mode-menu.component';
import { DevModeDialogComponent } from '@shared/components/dev-mode-dialog/dev-mode-dialog.component';
import { DevModeService } from '@shared/services/dev-mode.service';

export type SettingsView = 'main' | 'data' | 'dev';

@Component({
	selector: 'app-settings',
	standalone: true,
	templateUrl: './settings.component.html',
	imports: [
		CommonModule,
		TranslateModule,
		ActionRowComponent,
		LangDropdownComponent,
		DataManagementComponent,
		DevModeMenuComponent,
		DevModeDialogComponent
	]
})
export class SettingsComponent extends BaseComponent implements OnInit {
	currentView: SettingsView = 'main';
	showDevDialog: boolean = false;
	versionTapCount: number = 0;

	public devModeSvc = inject(DevModeService);
	private route = inject(ActivatedRoute);

	ngOnInit(): void {
		this.userSvc.page.set('pages.settings.settings');

		this.route.queryParams.subscribe((params: Params) => {
			if (params['view'] === 'dev' && this.devModeSvc.isDevModeActive()) {
				this.currentView = 'dev';
			}
		});
	}

	public goToDataManagement(): void {
		this.currentView = 'data';
	}

	public goToDevMode(): void {
		if (this.devModeSvc.isDevModeActive()) {
			this.currentView = 'dev';
		} else {
			this.showDevDialog = true;
		}
	}

	public onDevModeActivated(): void {
		this.currentView = 'dev';
	}

	public onVersionTap(): void {
		this.versionTapCount++;
		if (this.versionTapCount >= 5) {
			this.versionTapCount = 0;
			this.goToDevMode();
		}
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
