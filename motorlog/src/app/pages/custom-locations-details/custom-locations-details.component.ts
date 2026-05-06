import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@shared/base.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
	selector: 'app-custom-locations-details',
	standalone: true,
	imports: [
		CommonModule,
		TranslateModule,
		NgxSpinnerModule,
		InputTextModule,
		FormsModule,
		ReactiveFormsModule,
		ButtonModule
	],
	templateUrl: './custom-locations-details.component.html'
})
export class CustomLocationsDetailsComponent extends BaseComponent implements OnInit {
	formBuilder = inject(FormBuilder);
	customLocationForm: FormGroup;
	public ref = inject(DynamicDialogRef, { optional: true });

	ngOnInit(): void {
		this.initForm();
	}

	public onSubmit(): void {
		if (this.customLocationForm.valid) {
			this.newCustomLocation();
		} else {
			this.markFieldsAsTouched(this.customLocationForm);
		}
	}

	private newCustomLocation(): void {
		this.spinnerSvc.show();
		this.userSvc.addCustomLocationToUser(this.customLocationForm.value).subscribe({
			next: (res: any) => {
				this.operationOK();
			},
			error: () => this.spinnerSvc.hide()
		});
	}

	private operationOK(): void {
		this.showSuccess();
		this.spinnerSvc.hide();
		if (this.ref) {
			this.ref.close(true);
		}
	}

	private initForm(): void {
		this.customLocationForm = this.formBuilder.group({
			label: ['', Validators.required],
			value: ['', Validators.required]
		});

		this.customLocationForm.get('label')?.valueChanges.subscribe((label: string) => {
			this.customLocationForm.patchValue({
				value: label.toLowerCase().replace(/ /g, '_')
			});
		});
	}
}
