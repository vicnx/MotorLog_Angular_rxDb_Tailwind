import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export type ActionRowIconType = 'primary' | 'blue' | 'amber' | 'red' | 'default';

@Component({
	selector: 'app-action-row',
	standalone: true,
	imports: [CommonModule, TranslateModule],
	templateUrl: './action-row.component.html'
})
export class ActionRowComponent {
	/** Título principal (clave i18n o texto plano) */
	@Input() title: string = '';

	/** Subtítulo o descripción secundaria (opcional) */
	@Input() subtitle?: string;

	/** Icono de FontAwesome (ej. 'fas fa-database') */
	@Input() icon?: string;

	/** Variante visual del icono */
	@Input() iconType: ActionRowIconType = 'default';

	/** URL de avatar para filas tipo perfil */
	@Input() avatarUrl?: string;

	/** Texto/clave i18n para badge o pastilla inferior */
	@Input() badge?: string;

	/** Icono a la derecha (por defecto chevron) */
	@Input() rightIcon: string = 'fas fa-chevron-right';

	/** Si debe mostrar el icono de acción derecho */
	@Input() showRightIcon: boolean = true;

	/** Si es una fila de acción destructiva o de peligro */
	@Input() isDanger: boolean = false;

	/** Si la fila está envuelta en un card completo o si es ítem de lista dividida */
	@Input() isStandaloneCard: boolean = false;

	/** Emite al hacer clic sobre la fila */
	@Output() action = new EventEmitter<void>();

	public onClick(): void {
		this.action.emit();
	}

	public getIconContainerClasses(): string {
		switch (this.iconType) {
			case 'primary':
				return 'bg-primary-50 dark:bg-primary-950/40 text-primary-500 border-primary-100 dark:border-primary-900/30';
			case 'blue':
				return 'bg-blue-50 dark:bg-blue-950/40 text-blue-500 border-blue-100 dark:border-blue-900/30';
			case 'amber':
				return 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-100 dark:border-amber-900/30';
			case 'red':
				return 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/40';
			case 'default':
			default:
				return 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 border-gray-200/60 dark:border-gray-700/60';
		}
	}
}
