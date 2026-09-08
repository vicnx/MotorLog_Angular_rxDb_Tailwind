import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { DevModeService } from '@shared/services/dev-mode.service';

@Component({
	selector: 'app-dev-mode-dialog',
	standalone: true,
	imports: [CommonModule, FormsModule, TranslateModule, DialogModule],
	templateUrl: './dev-mode-dialog.component.html'
})
export class DevModeDialogComponent {
	private devModeSvc = inject(DevModeService);

	@Input() visible: boolean = false;
	@Output() visibleChange = new EventEmitter<boolean>();
	@Output() success = new EventEmitter<void>();

	password: string = '';
	showPassword: boolean = false;
	errorMessage: string = '';
	isLoading: boolean = false;

	public close(): void {
		this.visible = false;
		this.visibleChange.emit(false);
		this.resetForm();
	}

	public toggleShowPassword(): void {
		this.showPassword = !this.showPassword;
	}

	public async onSubmit(): Promise<void> {
		if (!this.password.trim()) {
			return;
		}

		this.isLoading = true;
		this.errorMessage = '';

		const isValid = await this.devModeSvc.verifyPassword(this.password.trim());
		if (!isValid) {
			this.isLoading = false;
			this.errorMessage = 'dev_mode.dialog.error_password';
			return;
		}

		const entered = await this.devModeSvc.enterDevMode();
		this.isLoading = false;

		if (entered) {
			this.close();
			this.success.emit();
		} else {
			this.errorMessage = 'dev_mode.dialog.error_password';
		}
	}

	private resetForm(): void {
		this.password = '';
		this.showPassword = false;
		this.errorMessage = '';
		this.isLoading = false;
	}
}
