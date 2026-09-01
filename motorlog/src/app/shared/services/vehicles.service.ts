import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, from, of, switchMap } from 'rxjs';
import { DBService } from './db.service';
import { BrandService } from './brand.service';
import { VehicleModel } from '@shared/models/vehicle.model';
import { BrandModel } from '@shared/models/brand.model';
import { Maintenance } from '@shared/models/maintenance.model';
import * as crypto from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VehiclesService {
	private static readonly SELECTED_VEHICLE_KEY = 'selected_vehicle_id';

	// Inyecciones de dependencias
	private http = inject(HttpClient);
	private dbSvc = inject(DBService);
	public brandSvc = inject(BrandService);

	// Rutas de datos estáticos
	private readonly urlIcons: string = './assets/data/icons.json';
	private readonly urlVehicleBrands: string = './assets/data/vehicle-brands.json';
	private readonly urlServiceTypes: string = './assets/data/service-types.json';

	// Estado reactivo global con Signals
	public vehicles = signal<VehicleModel[]>([]);
	public vehiclesBrands = signal<BrandModel[]>([]);
	public vehicleSelected = signal<VehicleModel>({} as VehicleModel);
	public vehicleSelectedId = signal<string>('');
	public maintenanceSearchQuery = signal<string>('');
	public isSearchOpen = signal<boolean>(false);

	// ==========================================
	// 1. CARGA DE METADATOS Y CATÁLOGOS
	// ==========================================

	public getIcons(): Observable<any> {
		return this.http.get(this.urlIcons);
	}

	public getVehicleBrands(): Observable<BrandModel[]> {
		return this.http.get<BrandModel[]>(this.urlVehicleBrands);
	}

	public getServiceTypes(): Observable<any[]> {
		return this.http.get<any[]>(this.urlServiceTypes);
	}

	public loadVehicleBrands(): void {
		this.getVehicleBrands().subscribe({
			next: (brands) => {
				this.vehiclesBrands.set(brands);
				this.brandSvc.setBrands(brands);
			}
		});
	}

	// ==========================================
	// 2. GESTIÓN DE VEHÍCULOS
	// ==========================================

	/** Carga los vehículos de RxDB y restaura el seleccionado desde localStorage o el primero disponible. */
	public getSavedVehicles(): void {
		this.dbSvc.db.vehicles
			.find({})
			.exec()
			.then((results: any[]) => {
				const parsed = results.map((r) => (r.toJSON ? r.toJSON() : r)) as VehicleModel[];
				this.vehicles.set(parsed);

				if (parsed.length > 0) {
					const savedId = localStorage.getItem(VehiclesService.SELECTED_VEHICLE_KEY);
					const target = (savedId && parsed.find((v) => v.id === savedId)) || parsed[0];
					this.getVehicleById(target.id);
				} else {
					this.setSelectedVehicle(null);
				}
			});
	}

	/** Busca un vehículo por su ID en RxDB y lo establece como activo. */
	public getVehicleById(id: string): Promise<VehicleModel | null> {
		return this.dbSvc.db.vehicles
			.findOne()
			.where('id')
			.equals(id)
			.exec()
			.then((doc: any) => {
				if (doc) {
					const vehicle = (doc.toJSON ? doc.toJSON() : doc) as VehicleModel;
					this.setSelectedVehicle(vehicle);
					return vehicle;
				}
				return null;
			});
	}

	/** Inserta un nuevo vehículo y lo selecciona inmediatamente como activo. */
	public addVehicle(vehicleData: VehicleModel): Observable<VehicleModel> {
		vehicleData.id = this.generateUniqueId(vehicleData.nombreVehiculo, vehicleData.marca, vehicleData.modelo);
		return from(this.dbSvc.db.vehicles.insert(vehicleData as any)).pipe(
			switchMap((doc: any) => {
				const res = (doc.toJSON ? doc.toJSON() : doc) as VehicleModel;
				this.setSelectedVehicle(res);
				return of(res);
			})
		);
	}

	/** Actualiza los datos de un vehículo existente. */
	public updateVehicle(id: string, vehicleData: VehicleModel): Observable<unknown> {
		return this.mutateVehicle(id, () => vehicleData);
	}

	/** Genera un hash determinista de 10 caracteres a partir del nombre, marca y modelo. */
	public generateUniqueId(nombreVehiculo: string, marca: string, modelo: string): string {
		const data = `${nombreVehiculo}_${marca}_${modelo}`;
		return crypto.SHA256(data).toString().substring(0, 10);
	}

	// ==========================================
	// 3. GESTIÓN DE MANTENIMIENTOS
	// ==========================================

	public getNextMaintenanceId(): string {
		return uuidv4();
	}

	public getMaintenanceById(maintenanceId: string): Maintenance | undefined {
		return this.vehicleSelected()?.mantenimientos?.find((m: Maintenance) => m.id.toString() === maintenanceId);
	}

	/** Añade un mantenimiento a la lista del vehículo indicado y recarga el vehículo activo. */
	public addMaintenanceToVehicle(
		vehicleId: string,
		newMaintenance: Omit<Maintenance, 'id'>
	): Observable<VehicleModel | null> {
		const maintenanceWithId: Maintenance = {
			...newMaintenance,
			id: this.getNextMaintenanceId(),
			date: newMaintenance.date.toString()
		};

		return this.mutateVehicle(vehicleId, (vehicle) => ({
			mantenimientos: [...(vehicle.mantenimientos || []), maintenanceWithId]
		})).pipe(switchMap(() => this.getVehicleById(vehicleId)));
	}

	/** Actualiza un mantenimiento específico dentro del vehículo. */
	public updateMaintenance(
		vehicleId: string,
		maintenanceId: string,
		maintenanceData: Partial<Maintenance>
	): Observable<unknown> {
		const prepared = this.prepareMaintenanceData(maintenanceData);
		return this.mutateVehicle(vehicleId, (vehicle) => ({
			mantenimientos: (vehicle.mantenimientos || []).map((m: Maintenance) =>
				m.id.toString() === maintenanceId ? { ...m, ...prepared } : m
			)
		}));
	}

	/** Elimina un mantenimiento de la lista del vehículo. */
	public deleteMaintenance(vehicleId: string, maintenanceId: string): Observable<unknown> {
		return this.mutateVehicle(vehicleId, (vehicle) => ({
			mantenimientos: (vehicle.mantenimientos || []).filter((m: Maintenance) => m.id.toString() !== maintenanceId)
		}));
	}

	/** Repara IDs duplicados generados en versiones anteriores. */
	public fixDuplicateMaintenanceIds(
		vehicle: VehicleModel & { update?: (query: unknown) => Promise<unknown> }
	): Observable<unknown> {
		const existingIds = new Set<string | number>();
		let hasDuplicates = false;

		const updatedMaintenances = (vehicle.mantenimientos || []).map((maintenance: Maintenance) => {
			if (existingIds.has(maintenance.id)) {
				hasDuplicates = true;
				return { ...maintenance, id: uuidv4() };
			}
			existingIds.add(maintenance.id);
			return maintenance;
		});

		if (hasDuplicates && typeof vehicle.update === 'function') {
			return from(vehicle.update({ $set: { mantenimientos: updatedMaintenances } }));
		}
		return of(vehicle);
	}

	// ==========================================
	// 4. HELPERS PRIVADOS REUTILIZABLES
	// ==========================================

	/** Actualiza el vehículo seleccionado tanto en las Signals de la app como en localStorage. */
	private setSelectedVehicle(vehicle: VehicleModel | null): void {
		if (vehicle && vehicle.id) {
			this.vehicleSelected.set(vehicle);
			this.vehicleSelectedId.set(vehicle.id);
			localStorage.setItem(VehiclesService.SELECTED_VEHICLE_KEY, vehicle.id);
		} else {
			this.vehicleSelected.set({} as VehicleModel);
			this.vehicleSelectedId.set('');
			localStorage.removeItem(VehiclesService.SELECTED_VEHICLE_KEY);
		}
	}

	/** Helper unificado para buscar y mutar documentos de vehículos en RxDB reduciendo repetición. */
	private mutateVehicle(
		vehicleId: string,
		mutation: (vehicle: VehicleModel) => Partial<VehicleModel>
	): Observable<unknown> {
		return from(this.dbSvc.db.vehicles.findOne(vehicleId).exec()).pipe(
			switchMap((doc: any) => {
				if (!doc) {
					throw new Error(`Vehicle with id ${vehicleId} not found`);
				}
				const current = (doc.toJSON ? doc.toJSON() : doc) as VehicleModel;
				const updatedFields = mutation(current);
				return from(doc.update({ $set: updatedFields }));
			})
		);
	}

	/** Formatea fechas y etiquetas de tipos de servicio para persistencia limpia. */
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
}
