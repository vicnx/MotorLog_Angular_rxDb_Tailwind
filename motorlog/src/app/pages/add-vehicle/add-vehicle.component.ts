import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from '@shared/base.component';
import { UserService } from '@shared/services/user.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
	selector: 'app-add-vehicle',
	standalone: true,
	imports: [CommonModule, TranslateModule, NgxSpinnerModule, DropdownModule, FormsModule, ButtonModule],
	templateUrl: './add-vehicle.component.html'
})
export class AddVehicleComponent extends BaseComponent implements OnInit {
  //FAKE INFO
  marcas = ['Marca 1', 'Marca 2', 'Marca 3'];
  modelos = ['Modelo 1', 'Modelo 2', 'Modelo 3'];
  iconos = ['fa-car', 'fa-truck', 'fa-motorcycle'];

  marcaSeleccionada: string;
  modeloSeleccionado: string;
  iconoSeleccionado: string;
	ngOnInit(): void {
		console.log('ADD VEHICLE');
	}
}
