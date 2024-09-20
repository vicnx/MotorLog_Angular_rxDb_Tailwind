import { CommonModule } from '@angular/common';
import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
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

  constructor(private cdr: ChangeDetectorRef) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isVisible = window.scrollY > 200; // Cambia el valor según sea necesario
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
