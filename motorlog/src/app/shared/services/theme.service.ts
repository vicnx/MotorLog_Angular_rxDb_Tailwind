import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ThemeService {
    private isDarkModeSubject = new BehaviorSubject<boolean>(false);
    isDarkMode$: Observable<boolean> = this.isDarkModeSubject.asObservable();

    toggleDarkMode(): void {
        this.isDarkModeSubject.next(!this.isDarkModeSubject.value);
    }
}
