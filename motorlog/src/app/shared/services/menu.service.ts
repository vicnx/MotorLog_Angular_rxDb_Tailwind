import { Injectable, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class MenuService {
    userSvc = inject(UserService);
    private showMenuSubject = new BehaviorSubject<boolean>(false);
    showMenu$: Observable<boolean> = this.showMenuSubject.asObservable();
    url: string = './assets/data/menu.json';
    userLogged = false;
    constructor(private http: HttpClient) {
      effect(()=>{
        this.userLogged = this.userSvc.user() ? true : false;
      })
    }

    getMenuItems(): Observable<any> {
        return this.http.get(this.url);
    }

    toogleMenu(): void {
      this.showMenuSubject.next(!this.showMenuSubject.value);
    }
}
