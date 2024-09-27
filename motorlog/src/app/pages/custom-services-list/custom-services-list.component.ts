import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@shared/base.component';

@Component({
	selector: 'app-custom-services-list',
	templateUrl: './custom-services-list.component.html',
	standalone: true,
	imports: [CommonModule, TranslateModule]
})
export class CustomServicesListComponent extends BaseComponent implements OnInit {
	ngOnInit() {
		this.userSvc.page.update((val) => (val = 'pages.custom-services-list.title'));
  }

}
