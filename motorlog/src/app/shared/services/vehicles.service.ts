import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, from, switchMap, tap } from 'rxjs';
import { UserService } from './user.service';
import { DBService } from './db.service';
import { UtilsService } from './utils.service';
import { VehicleModel } from '@shared/models/vehicle.model';
import * as crypto from 'crypto-js';
import { Maintenance } from '@shared/models/maintenance.model';
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
	urlServiceTypes: string = './assets/data/service-types.json';
	http = inject(HttpClient);

	getVehicleIcons(): Observable<any> {
		return this.http.get(this.urlIcons);
	}

	getVehicleBrands(): Observable<any> {
		return this.http.get(this.urlVehicleBrands);
	}

	getServiceTypes(): Observable<any> {
		return this.http.get(this.urlServiceTypes);
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
			// Por defecto, al obtener los vehiculos se selecciona el primero en toda la aplicación.
			this.vehicleSelected.update((val) => (val = this.vehicles()[0]));
		});
	}

	getVehicleById(id: string): Promise<any> {
		//prettier-ignore
		return this.dbSvc.db.vehicles.findOne().where('id').equals(id).exec().then((vehicle: any) => {
				if (vehicle) {
					// Actualizar directamente el signal con la nueva información del vehículo
					this.vehicleSelected.set(vehicle.toJSON());
				}
				return vehicle; // Devolver el vehículo por si se necesita en otro contexto
			});
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

	getNextMaintenanceId(vehicle: any): number {
    return vehicle.mantenimientos.length + 1;
	}

	addMaintenanceToVehicle(vehicleId: string, newMaintenance: Omit<Maintenance, 'id'>): Observable<any> {
		return from(this.dbSvc.db.vehicles.findOne(vehicleId).exec()).pipe(
			switchMap((vehicle: any) => {
				if (vehicle) {
					const vehicleData = vehicle.toJSON();
					const nextId = this.getNextMaintenanceId(vehicleData);
					const maintenanceWithId = { ...newMaintenance, id: nextId, date: newMaintenance.date.toString() };
					const updatedMaintenances = [...vehicleData.mantenimientos, maintenanceWithId];
					return from(
						vehicle.update({
							$set: { mantenimientos: updatedMaintenances }
						})
					).pipe(switchMap(() => this.getVehicleById(vehicleId)));
				} else {
					throw new Error(`Vehicle with id ${vehicleId} not found`);
				}
			})
		);
	}

  public getMaintenanceById(maintenanceId: string): Maintenance | undefined {
    const vehicle = this.vehicleSelected();
    return vehicle?.mantenimientos.find((maintenance: Maintenance) => maintenance.id.toString() === maintenanceId);
  }

  public updateMaintenance(vehicleId: string, maintenanceId: string, maintenanceData: any): Observable<any> {
    const preparedData = this.prepareMaintenanceData(maintenanceData);
    return from(this.dbSvc.db.vehicles.findOne(vehicleId).exec()).pipe(
      switchMap((vehicle: any) => {
        if (vehicle) {
          const updatedMaintenances = vehicle.mantenimientos.map((maint: any) =>
            maint.id.toString() == maintenanceId ? { ...maint, ...preparedData } : maint
          );
          return from(vehicle.update({ $set: { mantenimientos: updatedMaintenances } }));
        } else {
          throw new Error(`Vehicle with id ${vehicleId} not found`);
        }
      })
    );
  }

  public deleteMaintenance(vehicleId: string, maintenanceId: string): Observable<any> {
    console.log("deleteMaintenance called with vehicleId:", vehicleId, "and maintenanceId:", maintenanceId);
    return from(this.dbSvc.db.vehicles.findOne(vehicleId).exec()).pipe(
      switchMap((vehicle: any) => {
        if (vehicle) {
          const updatedMaintenances = vehicle.mantenimientos.filter((maint: any) =>
            maint.id.toString() !== maintenanceId
          );
          return from(vehicle.update({ $set: { mantenimientos: updatedMaintenances } }));
        } else {
          throw new Error(`Vehicle with id ${vehicleId} not found`);
        }
      })
    );
  }

  private prepareMaintenanceData(maintenance: any) {
    return {
      ...maintenance,
      date: maintenance.date.toISOString(),
      serviceType: maintenance.serviceType?.map((service: any) => ({
        ...service,
        label: service.label.toString()
      }))
    };
  }


}
