import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '@shared/services/user.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
@Component({
    selector: 'app-welcome-dialog-info',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        ButtonModule,
        TranslateModule
    ],
    templateUrl: './welcome-dialog-info.component.html',
})
export class WelcomeDialogInfoComponent {

	userSvc = inject(UserService);
  displayDialog: boolean = false;

  constructor() {
    effect(() => {
      if(this.userSvc.displayWelcomeDialogInfo()){
        this.displayDialog = true
      }else{
        this.displayDialog = false
      }
    });
  }

  public hideDialog(): void {
    this.userSvc.displayWelcomeDialogInfo.set(false)
  }
}