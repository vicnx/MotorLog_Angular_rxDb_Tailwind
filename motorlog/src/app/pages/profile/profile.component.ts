import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { AvatarDialogComponent } from '@shared/components/avatar-dialog/avatar-dialog.component';
import { ChangeNameDialogComponent } from '@shared/components/change-name-dialog/change-name-dialog.component';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [
		CommonModule,
		TranslateModule,
		ButtonModule,
		ConfirmDialogModule,
		AvatarDialogComponent,
		ChangeNameDialogComponent
	],
	templateUrl: './profile.component.html'
})
export class ProfileComponent extends BaseComponent implements OnInit {
	showAvatarDialog: boolean = false;
	showChangeNameDialog: boolean = false;

	ngOnInit(): void {
		this.userSvc.page.update((val) => (val = 'pages.profile.title'));
	}

	openAvatarDialog(): void {
		this.showAvatarDialog = true;
	}

	openChangeNameDialog(): void {
		this.showChangeNameDialog = true;
	}

	goToCustomServices(): void {
		this.routerSvc.navigate([CONSTANTS.routes.customServiceList]);
	}

	logoutUser(): void {
		this.confirmationSvc.confirm({
			message: this.translateSvc.instant('pages.profile.logout_confirm_msg'),
			header: this.translateSvc.instant('pages.profile.logout_confirm_header'),
			icon: 'fas fa-sign-out-alt text-red-500 text-xl',
			acceptButtonStyleClass: 'btn-danger !py-2 !px-4 !text-xs',
			rejectButtonStyleClass: 'btn-secondary !py-2 !px-4 !text-xs',
			acceptLabel: this.translateSvc.instant('confirm.default_yes'),
			rejectLabel: this.translateSvc.instant('confirm.default_no'),
			key: 'confirmDialog',
			accept: () => {
				this.userSvc.logoutUser();
			},
			reject: () => {}
		});
	}
}
