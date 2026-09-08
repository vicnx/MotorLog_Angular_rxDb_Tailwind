import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DevModeService } from '@shared/services/dev-mode.service';
import { CONSTANTS } from '@shared/app-constants';

@Component({
	selector: 'app-dev-badge',
	standalone: true,
	imports: [CommonModule, TranslateModule],
	templateUrl: './dev-badge.component.html'
})
export class DevBadgeComponent {
	public devModeSvc = inject(DevModeService);
	private router = inject(Router);

	public openDevMenu(): void {
		this.router.navigate([CONSTANTS.routes.settings], {
			queryParams: { view: 'dev' }
		});
	}

	public exitDevMode(event: Event): void {
		event.stopPropagation();
		this.devModeSvc.exitDevMode();
	}
}
