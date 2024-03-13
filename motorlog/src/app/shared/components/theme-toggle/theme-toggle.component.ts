import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ThemeService } from '@shared/services/theme.service';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    imports: [CommonModule],
    template: `<button class="fixed bottom-4 right-4 bg-gray-800 text-white rounded-full p-4 shadow-lg" (click)="toggleTheme()">
        {{ isDarkTheme ? 'Tema Claro' : 'Tema Oscuro' }}
    </button>`,
    styleUrls: ['./theme-toggle.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent implements OnInit {
    //TODO problema con primeng. funciona el cambio pero los componentes de primng no cambian de tema.
    isDarkTheme: boolean;
    // Services
    themeSvc = inject(ThemeService);
    constructor() {}

    ngOnInit(): void {
        this.themeSvc.isDarkMode$.subscribe((isDarkTheme) => (this.isDarkTheme = isDarkTheme));
    }

    toggleTheme() {
        this.themeSvc.toggleDarkMode();
    }
}
