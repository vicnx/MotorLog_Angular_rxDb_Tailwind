import { CommonModule } from '@angular/common';
import { Component, HostListener, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss'],
  imports: [CommonModule,Button]
})
export class ScrollTopComponent {
  isVisible = false;
  private router = inject(Router);

  constructor(private cdr: ChangeDetectorRef) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Si estamos en la página de añadir o editar mantenimiento, lo ocultamos
    const isMaintenanceForm = this.router.url.includes('/add-maintenance') || this.router.url.includes('/maintenance-details');
    
    if (isMaintenanceForm) {
      this.isVisible = false;
    } else {
      this.isVisible = window.scrollY > 200;
    }
    
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
