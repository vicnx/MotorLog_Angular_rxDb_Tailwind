import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
	selector: 'app-page-header',
	standalone: true,
	imports: [CommonModule, TranslateModule],
	templateUrl: './page-header.component.html'
})
export class PageHeaderComponent {
	private router = inject(Router);
	private location = inject(Location);

	/** Título principal (clave i18n o texto plano) */
	@Input({ required: true }) title: string = '';

	/** Subtítulo descriptivo opcional (clave i18n o texto plano) */
	@Input() subtitle?: string;

	/** Ruta a la que navegar al pulsar atrás (ej. '/vehicles-list'). Si no se define y no hay listener back, hace history.back() */
	@Input() backRoute?: string;

	/** Muestra u oculta el botón circular de retorno */
	@Input() showBackButton: boolean = true;

	/** Texto de accesibilidad / tooltip para el botón de retorno */
	@Input() backTitle?: string;

	/** Evento personalizado emitido al hacer clic en atrás */
	@Output() back = new EventEmitter<void>();

	public handleBack(): void {
		if (this.back.observed) {
			this.back.emit();
		} else if (this.backRoute) {
			this.router.navigate([this.backRoute]);
		} else {
			this.location.back();
		}
	}
}
