import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@shared/base.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-change-name-dialog',
  templateUrl: './change-name-dialog.component.html',
  standalone: true,
	imports: [DialogModule, TranslateModule, FormsModule]
})
export class ChangeNameDialogComponent extends BaseComponent  {
	@Input() visible: boolean = false;
	@Output() close = new EventEmitter<void>();
	newName: string = '';

  onApply(): void {
    this.userSvc.updateUser('1', { name: this.newName }).subscribe({
      next: (res) => {
        this.close.emit();
        console.log(this.userSvc.user())
      }
    })
		console.log('Nuevo nombre aplicado:', this.newName);
	}

  onDialogClose(): void {
    this.close.emit();
  }
}
