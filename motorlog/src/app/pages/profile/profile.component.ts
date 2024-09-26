import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@shared/base.component';
import { AvatarDialogComponent } from '@shared/components/avatar-dialog/avatar-dialog.component'; // Asegúrate de importar el componente de diálogo
import { ChangeNameDialogComponent } from '@shared/components/change-name-dialog/change-name-dialog.component';
import { SettingsButtonComponent } from '@shared/components/settings-button/settings-button.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule, TranslateModule, ButtonModule, AvatarDialogComponent, SettingsButtonComponent, ChangeNameDialogComponent],
  templateUrl: './profile.component.html'
})
export class ProfileComponent extends BaseComponent {
  userActions = [
    { label: 'userActions.generateAvatar.title', icon: 'fas fa-image', action: 'generateAvatar' },
    { label: 'userActions.changeName.title', icon: 'fas fa-user-edit', action: 'changeName' },
  ];

  showAvatarDialog: boolean = false;
  showChangeNameDialog: boolean = false;

  ngOnInit(): void {
    this.userSvc.page.update((val) => (val = 'pages.profile.title'));
  }

  handleUserAction(action: string) {
    switch (action) {
      case 'generateAvatar':
        this.showAvatarDialog = true;
        break;
      case 'changeName':
        this.showChangeNameDialog = true;
        break;
      default:
        console.log('Acción no reconocida');
    }
  }

  logoutUser(): void {
    this.userSvc.logoutUser();
  }
}
