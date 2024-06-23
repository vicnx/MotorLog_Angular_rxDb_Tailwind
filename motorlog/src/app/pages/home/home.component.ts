import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@shared/base.component';
import { VehicleSelectorComponent } from '@shared/components/vehicle-selector/vehicle-selector.component';
import { UserService } from '@shared/services/user.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule, TranslateModule, NgxSpinnerModule, VehicleSelectorComponent],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {
	ngOnInit(): void {
		console.log('Home Page');
	}
}
