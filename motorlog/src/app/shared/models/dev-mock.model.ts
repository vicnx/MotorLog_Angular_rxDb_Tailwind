import { UserModel } from './user.model';
import { VehicleModel } from './vehicle.model';
import { Maintenance } from './maintenance.model';

export interface DevMockDataModel {
	user: Partial<UserModel>;
	vehicles: VehicleModel[];
	maintenancesByVehicle: Record<string, Omit<Maintenance, 'id'>[]>;
}
