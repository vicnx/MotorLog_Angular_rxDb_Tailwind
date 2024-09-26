import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { DialogModule } from 'primeng/dialog';

@Component({
	selector: 'app-avatar-dialog',
	templateUrl: './avatar-dialog.component.html',
	standalone: true,
	imports: [DialogModule, TranslateModule]
})
export class AvatarDialogComponent extends BaseComponent {
	@Input() visible: boolean = false;
	@Output() close = new EventEmitter<void>();
	newAvatar: string = CONSTANTS.defaultImage;

	ngOnInit() {
		this.generateNewAvatar();
	}

	generateNewAvatar(): void {
		this.spinnerSvc.show();
		setTimeout(() => {
			this.newAvatar = this.utilsSvc.generateAvatar(this.userSvc.user().name + new Date().toString());
			this.spinnerSvc.hide();
		}, 500);
	}

	onApply(): void {
    this.userSvc.updateUser('1', { avatar: this.newAvatar }).subscribe({
      next: (res) => {
        this.close.emit();
      }
    })
		console.log('Nuevo avatar aplicado:', this.newAvatar);
	}

	onGenerateAnother(): void {
		this.generateNewAvatar();
	}

  onDialogClose(): void {
    this.close.emit(); // Emitir el evento de cierre cuando el diálogo se cierra
  }
}
