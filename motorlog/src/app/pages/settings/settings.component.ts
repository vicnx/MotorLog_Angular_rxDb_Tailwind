import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SettingsItemModel } from '@shared/models/menu.model';
import { BaseComponent } from '@shared/base.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';  // Si usas el componente de menú de PrimeNG

@Component({
  selector: 'app-settings',
	standalone: true,
  templateUrl: './settings.component.html',
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    ButtonModule,  // O cualquier otro módulo de PrimeNG que estés utilizando
    TooltipModule,
    MenuModule
  ]
})
export class SettingsComponent extends BaseComponent implements OnInit {
  http = inject(HttpClient);
  settingsMenu: SettingsItemModel[] = [];

  ngOnInit() {
    this.loadSettingsMenu();
  }

  loadSettingsMenu() {
    this.http.get<SettingsItemModel[]>('assets/data/settings-menu.json')
      .subscribe((data: any) => {
        this.settingsMenu = data.settingsMenu;
      }, error => {
        console.error('Error loading settings menu:', error);
      });
  }

  handleMenuAction(action: string) {
    switch (action) {
      case 'import':
        this.importData();
        break;
      case 'export':
        this.exportData();
        break;
      case 'delete':
        this.deleteData();
        break;
      case 'profile':
        // this.deleteData();
        this.showNotImplemented();
        break;
      default:
        console.warn('Action not found:', action);
    }
  }

  importData() {
    this.showNotImplemented();
    // Implementa la lógica de importar datos
    console.log('Importar datos');
  }

  exportData() {
    this.showNotImplemented();
    // Implementa la lógica de exportar datos
    console.log('Exportar datos');
  }

  deleteData() {
    this.showNotImplemented();
    // Implementa la lógica de borrar datos
    console.log('Borrar datos');
  }

  getTranslatedLabel(labelKey: string) {
    return this.translateSvc.instant(labelKey);
  }
}
