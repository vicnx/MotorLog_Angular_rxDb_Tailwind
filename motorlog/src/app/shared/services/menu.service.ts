import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class MenuService {
    private showMenuSubject = new BehaviorSubject<boolean>(false);
    showMenu$: Observable<boolean> = this.showMenuSubject.asObservable();

    url: string = './assets/data/menu.json';
    constructor(private http: HttpClient) {}

    getMenuItems(): Observable<any> {
        return this.http.get(this.url);
    }

    toogleMenu(): void {
      console.log(!this.showMenuSubject.value)
      this.showMenuSubject.next(!this.showMenuSubject.value);
    }
}
