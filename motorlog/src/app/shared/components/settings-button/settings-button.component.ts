import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@shared/base.component';

@Component({
	selector: 'app-settings-button',
	templateUrl: './settings-button.component.html',
	styleUrls: ['./settings-button.component.css'],
	standalone: true,
	imports: [CommonModule, TranslateModule]
})
export class SettingsButtonComponent extends BaseComponent implements OnInit {
	@Input() action: any;
	@Output() handleAction = new EventEmitter<string>();

	ngOnInit() {}

	handleUserAction(action: string) {
		this.handleAction.emit(action);
	}
}
