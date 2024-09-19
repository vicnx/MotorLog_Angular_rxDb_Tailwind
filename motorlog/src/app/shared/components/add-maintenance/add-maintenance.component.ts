import { Component, AfterViewInit } from '@angular/core';
import { CONSTANTS } from '@shared/app-constants';
import { BaseComponent } from '@shared/base.component';
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'app-add-maintenance',
	standalone: true,
	imports: [ButtonModule],
	templateUrl: './add-maintenance.component.html',
	styleUrls: ['./add-maintenance.component.scss']
})
export class AddMaintenanceComponent extends BaseComponent implements AfterViewInit {
	navigate() {
		this.routerSvc.navigate([CONSTANTS.routes.addMaintenance]);
	}

	ngAfterViewInit() {
		const floatingButton = document.querySelector('.floating-button') as HTMLElement;
		let isDragging = false;
		let offsetX = 0,
			offsetY = 0;

		const updatePosition = (x: number, y: number) => {
			const buttonWidth = floatingButton.offsetWidth;
			const buttonHeight = floatingButton.offsetHeight;
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;

			const newX = Math.max(0, Math.min(x, windowWidth - buttonWidth));
			const newY = Math.max(0, Math.min(y, windowHeight - buttonHeight));

			floatingButton.style.left = `${newX}px`;
			floatingButton.style.top = `${newY}px`;
			floatingButton.style.position = 'absolute';
		};

		floatingButton?.addEventListener('mousedown', (e: MouseEvent) => {
			isDragging = true;
			offsetX = e.clientX - floatingButton.getBoundingClientRect().left;
			offsetY = e.clientY - floatingButton.getBoundingClientRect().top;
			floatingButton.style.cursor = 'grabbing';
		});

		document.addEventListener('mousemove', (e: MouseEvent) => {
			if (isDragging) {
				const x = e.clientX - offsetX;
				const y = e.clientY - offsetY;
				updatePosition(x, y);
			}
		});

		document.addEventListener('mouseup', () => {
			isDragging = false;
			floatingButton.style.cursor = 'grab';
		});

		floatingButton?.addEventListener('touchstart', (e: TouchEvent) => {
			isDragging = true;
			const touch = e.touches[0];
			offsetX = touch.clientX - floatingButton.getBoundingClientRect().left;
			offsetY = touch.clientY - floatingButton.getBoundingClientRect().top;
			floatingButton.style.cursor = 'grabbing';
		});

		document.addEventListener('touchmove', (e: TouchEvent) => {
			if (isDragging) {
				const touch = e.touches[0];
				const x = touch.clientX - offsetX;
				const y = touch.clientY - offsetY;
				updatePosition(x, y);
			}
		});

		document.addEventListener('touchend', () => {
			isDragging = false;
			floatingButton.style.cursor = 'grab';
		});
	}
}
