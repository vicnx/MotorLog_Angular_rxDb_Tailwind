import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';

@Component({
	selector: 'app-image-selector',
	standalone: true,
	templateUrl: './image-selector.component.html',
	imports: [CommonModule, FileUploadModule, DialogModule]
})
export class ImageSelectorComponent {
	@Input() imageControl!: FormControl;
	@Input() label: string = 'Selecciona una imagen';
	@Input() modoConsulta: boolean = false;;
	@ViewChild('fileUpload') fileUpload!: FileUpload;
	showModal: boolean = false;

	onFileUpload(event: any): void {
		if (event.files && event.files.length > 0) {
			const file = event.files[0];
			const reader = new FileReader();

			reader.onload = (e: any) => {
				this.imageControl.setValue(e.target.result);
			};

			reader.readAsDataURL(file);
		} else {
			console.error('No se ha seleccionado ningún archivo');
		}
	}

	onRemoveImage() {
		this.imageControl.setValue(null);
		if (this.fileUpload) {
			this.fileUpload.clear();
			this.fileUpload.files = [];
		}
	}

	openModal() {
		this.showModal = true;
	}

	closeModal() {
		this.showModal = false;
	}

	downloadImage() {
		const imageUrl = this.imageControl.value;
		if (imageUrl) {
			const link = document.createElement('a');
			link.href = imageUrl;
			link.download = 'imagen_mantenimiento.jpg'; // Cambia el nombre del archivo si es necesario
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
}
