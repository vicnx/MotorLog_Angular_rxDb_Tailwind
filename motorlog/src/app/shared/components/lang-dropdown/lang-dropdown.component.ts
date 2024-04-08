import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';

@Component({
	selector: 'app-lang-dropdown',
	standalone: true,
	imports: [CommonModule, DropdownModule, FormsModule],
	templateUrl: './lang-dropdown.component.html',
	styleUrls: ['./lang-dropdown.component.scss']
})
export class LangDropdownComponent implements OnInit {
	langs: any[] | undefined;
	selectedLang: any | undefined;
	translateSvc = inject(TranslateService);

	ngOnInit(): void {
		this.initUi();
		this.translateSvc.onLangChange.subscribe(() => {
			this.initUi();
		});
	}

	public switchLang(event: DropdownChangeEvent): void {
		this.translateSvc.use(event.value).subscribe(() => {
			this.translateSvc.reloadLang(event.value);
		});
	}

	public initUi(): void {
		this.translateSvc.onLangChange;
		this.langs = [
			{ icon: 'fi fi-es', label: this.translateSvc.instant('lang.spanish'), value: 'es' },
			{ icon: 'fi fi-us', label: this.translateSvc.instant('lang.english'), value: 'en' }
		];
		this.selectedLang = this.translateSvc.currentLang;
	}
}
