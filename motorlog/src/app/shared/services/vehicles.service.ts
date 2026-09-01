import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, from, of, switchMap } from 'rxjs';
import { UserService } from './user.service';
import { DBService } from './db.service';
import { UtilsService } from './utils.service';
import { VehicleModel } from '@shared/models/vehicle.model';
import { BrandModel } from '@shared/models/brand.model';
import { Maintenance } from '@shared/models/maintenance.model';
import * as crypto from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VehiclesService {
	dbSvc = inject(DBService);
	utilsSvc = inject(UtilsService);
	vehicles = signal<VehicleModel[]>([]);
	vehiclesBrands = signal<BrandModel[]>([]);
	vehicleSelected = signal<VehicleModel>({} as VehicleModel);
	vehicleSelectedId = signal<string>('');
	userSvc = inject(UserService);
	urlIcons: string = './assets/data/icons.json';
	urlVehicleBrands: string = './assets/data/vehicle-brands.json';
	urlServiceTypes: string = './assets/data/service-types.json';
	http = inject(HttpClient);

	getIcons(): Observable<any> {
		return this.http.get(this.urlIcons);
	}

	getVehicleBrands(): Observable<any> {
		return this.http.get(this.urlVehicleBrands);
	}

	getServiceTypes(): Observable<any[]> {
		return this.http.get<any[]>(this.urlServiceTypes);
	}

	addVehicle(vehicleData: VehicleModel): Observable<VehicleModel> {
		vehicleData.id = this.generateUniqueId(vehicleData.nombreVehiculo, vehicleData.marca, vehicleData.modelo);
		const query = this.dbSvc.db.vehicles.insert(vehicleData as any);
		return from(query).pipe(switchMap((doc: any) => of(doc.toJSON ? doc.toJSON() : doc)));
	}

	generateUniqueId(nombreVehiculo: string, marca: string, modelo: string): string {
		const data = `${nombreVehiculo}_${marca}_${modelo}`;
		const hash = crypto.SHA256(data).toString();
		return hash.substring(0, 10);
	}

	getSavedVehicles(): void {
		const query = this.dbSvc.db.vehicles.find({});
		query.exec().then((results: any[]) => {
			const parsed = results.map((r) => (r.toJSON ? r.toJSON() : r));
			this.vehicles.set(parsed);
			if (
				!this.vehicleSelected() ||
				(typeof this.vehicleSelected() === 'object' && Object.keys(this.vehicleSelected()).length === 0)
			) {
				this.vehicleSelected.set(this.vehicles()[0]);
			} else {
				this.getVehicleById(this.vehicleSelected().id);
			}
		});
	}

	getVehicleById(id: string): Promise<VehicleModel | null> {
		return this.dbSvc.db.vehicles
			.findOne()
			.where('id')
			.equals(id)
			.exec()
			.then((doc: any) => {
				if (doc) {
					const vehicle = doc.toJSON ? doc.toJSON() : doc;
					this.vehicleSelected.set(vehicle);
					return vehicle;
				}
				return null;
			});
	}

	loadVehicleBrands(): void {
		this.http.get<BrandModel[]>(this.urlVehicleBrands).subscribe({
			next: (res) => {
				this.vehiclesBrands.set(res);
			}
		});
	}

	updateVehicle(id: string, vehicleData: VehicleModel): Observable<unknown> {
		return from(this.dbSvc.db.vehicles.findOne(id).exec()).pipe(
			switchMap((doc: any) => {
				if (doc) {
					return from(doc.update({ $set: vehicleData }));
				} else {
					throw new Error(`Vehicle with id ${id} not found`);
				}
			})
		);
	}

	getNextMaintenanceId(): string {
		return uuidv4();
	}

	addMaintenanceToVehicle(vehicleId: string, newMaintenance: Omit<Maintenance, 'id'>): Observable<VehicleModel | null> {
		return from(this.dbSvc.db.vehicles.findOne(vehicleId).exec()).pipe(
			switchMap((doc: any) => {
				if (doc) {
					const vehicleData = doc.toJSON ? doc.toJSON() : doc;
					const nextId = this.getNextMaintenanceId();
					const maintenanceWithId: Maintenance = {
						...newMaintenance,
						id: nextId,
						date: newMaintenance.date.toString()
					};
					const updatedMaintenances = [...(vehicleData.mantenimientos || []), maintenanceWithId];
					return from(
						doc.update({
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
		return vehicle?.mantenimientos?.find((m: Maintenance) => m.id.toString() === maintenanceId);
	}

	public updateMaintenance(
		vehicleId: string,
		maintenanceId: string,
		maintenanceData: Partial<Maintenance>
	): Observable<unknown> {
		const preparedData = this.prepareMaintenanceData(maintenanceData);
		return from(this.dbSvc.db.vehicles.findOne(vehicleId).exec()).pipe(
			switchMap((doc: any) => {
				if (doc) {
					const vehicleData = doc.toJSON ? doc.toJSON() : doc;
					const updatedMaintenances = (vehicleData.mantenimientos || []).map((maint: Maintenance) =>
						maint.id.toString() === maintenanceId ? { ...maint, ...preparedData } : maint
					);
					return from(doc.update({ $set: { mantenimientos: updatedMaintenances } }));
				} else {
					throw new Error(`Vehicle with id ${vehicleId} not found`);
				}
			})
		);
	}

	public deleteMaintenance(vehicleId: string, maintenanceId: string): Observable<unknown> {
		return from(this.dbSvc.db.vehicles.findOne(vehicleId).exec()).pipe(
			switchMap((doc: any) => {
				if (doc) {
					const vehicleData = doc.toJSON ? doc.toJSON() : doc;
					const updatedMaintenances = (vehicleData.mantenimientos || []).filter(
						(maint: Maintenance) => maint.id.toString() !== maintenanceId
					);
					return from(doc.update({ $set: { mantenimientos: updatedMaintenances } }));
				} else {
					throw new Error(`Vehicle with id ${vehicleId} not found`);
				}
			})
		);
	}

	private prepareMaintenanceData(maintenance: Partial<Maintenance>): Record<string, unknown> {
		const formattedDate = maintenance.date instanceof Date ? maintenance.date.toISOString() : maintenance.date;
		const rawServiceType = maintenance.serviceType as { label?: { toString: () => string } }[] | undefined;
		return {
			...maintenance,
			date: formattedDate,
			serviceType: rawServiceType?.map((service) => ({
				...service,
				label: service.label ? service.label.toString() : ''
			}))
		};
	}

	fixDuplicateMaintenanceIds(vehicle: VehicleModel & { update?: (query: unknown) => Promise<unknown> }): Observable<unknown> {
		const existingIds = new Set<string | number>();
		let hasDuplicates = false;

		const updatedMaintenances = (vehicle.mantenimientos || []).map((maintenance: Maintenance) => {
			if (existingIds.has(maintenance.id)) {
				const maintenanceCopy: Maintenance = { ...maintenance, id: uuidv4() };
				hasDuplicates = true;
				return maintenanceCopy;
			} else {
				existingIds.add(maintenance.id);
				return maintenance;
			}
		});

		if (hasDuplicates && typeof vehicle.update === 'function') {
			return from(
				vehicle.update({
					$set: { mantenimientos: updatedMaintenances }
				})
			);
		}

		return of(vehicle);
	}
}
