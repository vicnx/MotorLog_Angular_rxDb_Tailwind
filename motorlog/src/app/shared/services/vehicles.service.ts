import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { UserService } from './user.service';
import { DBService } from './db.service';
import { UtilsService } from './utils.service';
import { VehicleModel } from '@shared/models/vehicle.model';
import * as crypto from 'crypto-js';
import { RxQuery } from 'rxdb';
@Injectable()
export class VehiclesService {
	dbSvc = inject(DBService);
	utilsSvc = inject(UtilsService);
	vehicles = signal<VehicleModel[]>([] as VehicleModel[]);
	vehiclesBrands = signal<any>([] as any);
	vehicleSelected = signal<VehicleModel>({} as VehicleModel);
	vehicleSelectedId = signal<string>('');
	userSvc = inject(UserService);
	urlIcons: string = './assets/data/icons.json';
	urlVehicleBrands: string = './assets/data/vehicle-brands.json';
	http = inject(HttpClient);

	getVehicleIcons(): Observable<any> {
		return this.http.get(this.urlIcons);
	}

	getVehicleBrands(): Observable<any> {
		return this.http.get(this.urlVehicleBrands);
	}

	addVehicle(vehicleData: VehicleModel): Observable<any> {
		vehicleData.id = this.generateUniqueId(vehicleData.nombreVehiculo, vehicleData.marca, vehicleData.modelo);
		const query = this.dbSvc.db.vehicles.insert(vehicleData as any);
		return from(query);
	}

	generateUniqueId(nombreVehiculo: string, marca: string, modelo: string): string {
		const data = `${nombreVehiculo}_${marca}_${modelo}`;
		const hash = crypto.SHA256(data).toString();
		return hash.substring(0, 10);
	}

	getSavedVehicles(): any {
		const query = this.dbSvc.db.vehicles.find({});
		query.exec().then((results: any) => {
			this.vehicles.update((val) => (val = results));
		});
	}

	getVehicleById(id: string): RxQuery<any> {
		const query = this.dbSvc.db.vehicles.findOne().where('id').equals(id);
		return query as any;
	}

	loadVehicleBrands(): any {
		this.http.get(this.urlVehicleBrands).subscribe({
			next: (res) => {
				this.vehiclesBrands.update((val) => (val = res));
			}
		});
	}

  updateVehicle(id: string, vehicleData: VehicleModel): Observable<any> {
    return from(this.dbSvc.db.vehicles.findOne(id).exec()).pipe(
      switchMap((vehicle: any) => {
        if (vehicle) {
          return from(vehicle.update({ $set: vehicleData }));
        } else {
          throw new Error(`Vehicle with id ${id} not found`);
        }
      })
    );
	}
}
