import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinner, NgxSpinnerComponent, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, TranslateModule, NgxSpinnerModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    constructor(public translateService: TranslateService, public spinner: NgxSpinnerService) {
      // this.spinner.show()
      console.log(this.translateService.instant('pages.home.title'))

    }
}
