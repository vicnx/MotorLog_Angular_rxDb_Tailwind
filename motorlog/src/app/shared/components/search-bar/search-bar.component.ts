import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
	selector: 'app-search-bar',
	standalone: true,
	imports: [CommonModule, TranslateModule],
	templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
	@ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

	/** Texto de búsqueda actual (soporta two-way binding [(value)]="query") */
	@Input() value: string = '';

	/** Estado de apertura del buscador (soporta two-way binding [(isOpen)]="isOpen") */
	@Input() isOpen: boolean = false;

	/** Clave i18n o texto para el placeholder */
	@Input() placeholder: string = 'pages.home.search_placeholder';

	/** Clave i18n o texto para el tooltip / aria-label del botón de apertura */
	@Input() buttonAriaLabel: string = 'Buscar';

	/** Ancho personalizado del input desplegado */
	@Input() widthClass: string = 'w-48 sm:w-64';

	/** Emite el valor modificado para two-way binding */
	@Output() valueChange = new EventEmitter<string>();

	/** Emite el estado de apertura para two-way binding */
	@Output() isOpenChange = new EventEmitter<boolean>();

	/** Evento emitido al buscar o cambiar texto */
	@Output() search = new EventEmitter<string>();

	/** Evento emitido al limpiar el texto */
	@Output() clear = new EventEmitter<void>();

	/** Evento emitido al cerrar el buscador */
	@Output() closed = new EventEmitter<void>();

	public openSearch(): void {
		this.isOpen = true;
		this.isOpenChange.emit(true);
		setTimeout(() => {
			this.searchInput?.nativeElement.focus();
		}, 50);
	}

	public onInputChange(event: Event): void {
		const val = (event.target as HTMLInputElement).value;
		this.value = val;
		this.valueChange.emit(val);
		this.search.emit(val);
	}

	public handleClearOrClose(): void {
		if (this.value.length > 0) {
			this.value = '';
			this.valueChange.emit('');
			this.clear.emit();
			if (this.searchInput) {
				this.searchInput.nativeElement.value = '';
				this.searchInput.nativeElement.focus();
			}
		} else {
			this.closeSearch();
		}
	}

	public closeSearch(): void {
		this.isOpen = false;
		this.isOpenChange.emit(false);
		this.value = '';
		this.valueChange.emit('');
		this.closed.emit();
	}
}
