import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class MenuService {
    private showMenuSubject = new BehaviorSubject<boolean>(false);
    showMenu$: Observable<boolean> = this.showMenuSubject.asObservable();

    private enableMenuSubject = new BehaviorSubject<boolean>(false);
    enableMenu$: Observable<boolean> = this.enableMenuSubject.asObservable();

    url: string = './assets/data/menu.json';
    constructor(private http: HttpClient) {}

    getMenuItems(): Observable<any> {
        return this.http.get(this.url);
    }

    toogleMenu(): void {
      this.showMenuSubject.next(!this.showMenuSubject.value);
    }

    checkEnableMenu(): void {
      //TODO Comprobar si hay usuario logeado. (crear servicio user)
      let isUserLogged = false;
      this.enableMenuSubject.next(isUserLogged)
    }
}
