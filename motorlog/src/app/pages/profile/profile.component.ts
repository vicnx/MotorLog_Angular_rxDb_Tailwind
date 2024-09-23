import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@shared/base.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [CommonModule, DropdownModule, FormsModule, TranslateModule, ButtonModule],
	templateUrl: './profile.component.html'
})
export class ProfileComponent extends BaseComponent  {

  userActions = [
    { label: 'userActions.generateAvatar', icon: 'fas fa-image', action: 'generateAvatar' },
    { label: 'userActions.changeName', icon: 'fas fa-user-edit', action: 'changeName' },
  ];

  handleUserAction(action: string) {
    switch(action) {
      case 'generateAvatar':
        this.showNotImplemented();
        // this.generateNewAvatar();
        break;
      case 'changeName':
        this.showNotImplemented();
        // this.changeUserName();
        break;
      default:
        console.log('Acción no reconocida');
    }
  }

  logoutUser(): void {
		this.userSvc.logoutUser();
  }

}
