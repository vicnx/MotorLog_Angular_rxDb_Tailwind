import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class VehiclesService {
    userSvc = inject(UserService);
    urlIcons: string = './assets/data/icons.json';
    http = inject(HttpClient)

    getVehicleIcons(): Observable<any> {
        return this.http.get(this.urlIcons);
    }
}
