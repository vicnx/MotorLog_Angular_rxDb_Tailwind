import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DataExportImportService } from '@shared/services/dataExportImport.service';
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
	dataSvc = inject(DataExportImportService);
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
    this.dataSvc.shouldShowBackupDialog.set(true);
  }
}
