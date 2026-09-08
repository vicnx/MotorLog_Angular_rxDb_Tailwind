import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { CONSTANTS } from '@shared/app-constants';
import { DevMockDataModel } from '@shared/models/dev-mock.model';
import { Maintenance } from '@shared/models/maintenance.model';
import { DBService } from './db.service';
import { UserService } from './user.service';
import { DataExportImportService } from './dataExportImport.service';
import { VehiclesService } from './vehicles.service';

@Injectable({ providedIn: 'root' })
export class DevModeService {
	private http = inject(HttpClient);
	private dbSvc = inject(DBService);
	private userSvc = inject(UserService);
	private dataSvc = inject(DataExportImportService);
	private vehiclesSvc = inject(VehiclesService);
	private router = inject(Router);
	private translateSvc = inject(TranslateService);
	private confirmationSvc = inject(ConfirmationService);
	private messageSvc = inject(MessageService);
	private spinnerSvc = inject(NgxSpinnerService);

	/** Ruta al dataset estático de datos mock para desarrollo */
	private readonly mockDataUrl = 'assets/data/mock-dev-data.json';
	private mockDataCache: DevMockDataModel | null = null;

	/** Estado reactivo del modo desarrollador */
	public isDevModeActive = signal<boolean>(
		localStorage.getItem(CONSTANTS.devMode.activeStorageKey) === 'true'
	);

	/** Estado reactivo de disponibilidad de snapshot de respaldo */
	public hasBackupSnapshot = signal<boolean>(
		!!localStorage.getItem(CONSTANTS.devMode.snapshotStorageKey)
	);

	/** Carga bajo demanda y cachea el archivo JSON de datos mock */
	private async getMockData(): Promise<DevMockDataModel> {
		if (!this.mockDataCache) {
			this.mockDataCache = await firstValueFrom(this.http.get<DevMockDataModel>(this.mockDataUrl));
		}
		return this.mockDataCache;
	}

	/** Valida la clave introducida comparando su hash SHA-256 nativo */
	public async verifyPassword(inputPassword: string): Promise<boolean> {
		if (!inputPassword) return false;
		try {
			const data = new TextEncoder().encode(inputPassword);
			const hashBuffer = await crypto.subtle.digest('SHA-256', data);
			const hashHex = Array.from(new Uint8Array(hashBuffer))
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('');
			return hashHex.toLowerCase() === CONSTANTS.devMode.passwordHash.toLowerCase();
		} catch (e) {
			console.error('Error calculando hash de clave dev:', e);
			return false;
		}
	}

	/** Activa el modo dev guardando snapshot previo y creando el usuario DevMode */
	public async enterDevMode(): Promise<boolean> {
		this.spinnerSvc.show();
		try {
			// 1. Snapshot de datos si hay usuario o vehículos previos
			const snapshot = await this.dataSvc.exportDataAsJsonString();
			const parsed = JSON.parse(snapshot);
			const hasData = (parsed.vehicles && parsed.vehicles.length > 0) || (parsed.user && parsed.user.length > 0);

			if (hasData) {
				localStorage.setItem(CONSTANTS.devMode.snapshotStorageKey, snapshot);
				this.hasBackupSnapshot.set(true);
			}

			// 2. Marcar modo activo
			localStorage.setItem(CONSTANTS.devMode.activeStorageKey, 'true');
			this.isDevModeActive.set(true);

			// 3. Limpiar vehículos previos de la base de datos
			const currentVehicles: any[] = await this.dbSvc.db.vehicles.find().exec();
			for (const v of currentVehicles) {
				await v.remove();
			}

			// 4. Crear usuario DevMode a partir del JSON mock
			const mockData = await this.getMockData();
			const devUserData = {
				...mockData.user,
				resgister_date: new Date().toISOString()
			};

			const userDoc: any = await this.dbSvc.db.user.findOne('1').exec();
			if (userDoc) {
				await userDoc.patch(devUserData);
			} else {
				await (this.dbSvc.db.user as any).insert(devUserData);
			}

			// 5. Refrescar estado global
			this.userSvc.getUser();
			this.userSvc.setLogginUser(true);
			this.vehiclesSvc.getSavedVehicles();

			this.messageSvc.add({
				key: 'toast',
				severity: 'success',
				summary: this.translateSvc.instant('dev_mode.title'),
				detail: this.translateSvc.instant('dev_mode.dialog.success')
			});

			return true;
		} catch (error) {
			console.error('Error al entrar en Dev Mode:', error);
			return false;
		} finally {
			this.spinnerSvc.hide();
		}
	}

	/** Muestra confirmación y ejecuta la salida de Dev Mode */
	public exitDevMode(): void {
		this.confirmationSvc.confirm({
			key: 'confirmDialog',
			header: this.translateSvc.instant('dev_mode.confirm_exit.header'),
			message: this.translateSvc.instant('dev_mode.confirm_exit.message'),
			icon: 'fas fa-exclamation-triangle text-amber-500 text-xl',
			acceptLabel: this.translateSvc.instant('confirm.default_yes'),
			rejectLabel: this.translateSvc.instant('confirm.default_no'),
			acceptButtonStyleClass: 'btn-primary !py-2 !px-4 !text-xs',
			rejectButtonStyleClass: 'btn-secondary !py-2 !px-4 !text-xs',
			accept: async () => {
				await this.performExit();
			}
		});
	}

	/** Restaura el snapshot guardado o limpia el entorno si no había copia previa */
	private async performExit(): Promise<void> {
		this.spinnerSvc.show();
		try {
			const snapshot = localStorage.getItem(CONSTANTS.devMode.snapshotStorageKey);

			// Limpiar flags locales
			localStorage.removeItem(CONSTANTS.devMode.activeStorageKey);
			localStorage.removeItem(CONSTANTS.devMode.snapshotStorageKey);
			this.isDevModeActive.set(false);
			this.hasBackupSnapshot.set(false);

			if (snapshot) {
				await this.dataSvc.importDataFromJsonString(snapshot);
			} else {
				await this.dataSvc.clearAllData();
				this.router.navigate([CONSTANTS.routes.welcome]);
				window.location.reload();
			}
		} catch (error) {
			console.error('Error al salir de Dev Mode:', error);
		} finally {
			this.spinnerSvc.hide();
		}
	}

	/** Inserta en RxDB los vehículos mock definidos en mock-dev-data.json */
	public async populateMockVehicles(): Promise<void> {
		this.spinnerSvc.show();
		try {
			const mockData = await this.getMockData();
			for (const v of mockData.vehicles) {
				await (this.dbSvc.db.vehicles as any).upsert(v);
			}

			this.vehiclesSvc.getSavedVehicles();

			this.messageSvc.add({
				key: 'toast',
				severity: 'success',
				summary: this.translateSvc.instant('dev_mode.title'),
				detail: this.translateSvc.instant('dev_mode.messages.vehicles_added')
			});
		} catch (error) {
			console.error('Error poblando vehículos mock:', error);
		} finally {
			this.spinnerSvc.hide();
		}
	}

	/** Asigna mantenimientos mock estructurados a cada vehículo correspondiente */
	public async populateMockMaintenances(): Promise<void> {
		this.spinnerSvc.show();
		try {
			const vehicles: any[] = await this.dbSvc.db.vehicles.find().exec();
			if (!vehicles || vehicles.length === 0) {
				this.messageSvc.add({
					key: 'toast',
					severity: 'warn',
					summary: this.translateSvc.instant('dev_mode.title'),
					detail: this.translateSvc.instant('dev_mode.messages.no_vehicles_for_maint')
				});
				this.spinnerSvc.hide();
				return;
			}

			const mockData = await this.getMockData();

			// Itera sobre los vehículos asignándoles sus mantenimientos con ID único
			for (const vDoc of vehicles) {
				const vehicle = vDoc.toJSON ? vDoc.toJSON() : vDoc;
				const rawMaint = mockData.maintenancesByVehicle[vehicle.id] || mockData.maintenancesByVehicle['dev_focus_st'] || [];
				const maintWithIds: Maintenance[] = rawMaint.map((m) => ({
					...m,
					id: uuidv4()
				}));

				await vDoc.patch({ mantenimientos: maintWithIds });
			}

			this.vehiclesSvc.getSavedVehicles();

			this.messageSvc.add({
				key: 'toast',
				severity: 'success',
				summary: this.translateSvc.instant('dev_mode.title'),
				detail: this.translateSvc.instant('dev_mode.messages.maintenances_added')
			});
		} catch (error) {
			console.error('Error poblando mantenimientos mock:', error);
		} finally {
			this.spinnerSvc.hide();
		}
	}

	/** Vacía los vehículos de prueba de la base de datos */
	public async clearMockData(): Promise<void> {
		this.spinnerSvc.show();
		try {
			const currentVehicles: any[] = await this.dbSvc.db.vehicles.find().exec();
			for (const v of currentVehicles) {
				await v.remove();
			}

			this.vehiclesSvc.getSavedVehicles();

			this.messageSvc.add({
				key: 'toast',
				severity: 'info',
				summary: this.translateSvc.instant('dev_mode.title'),
				detail: this.translateSvc.instant('dev_mode.messages.mock_cleared')
			});
		} catch (error) {
			console.error('Error vaciando datos mock:', error);
		} finally {
			this.spinnerSvc.hide();
		}
	}
}
