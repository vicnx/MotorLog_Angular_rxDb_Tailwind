import { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema, toTypedRxJsonSchema } from 'rxdb';
import { Maintenance, MAINTENANCE_SCHEMA } from './maintenance.model';
//prettier-ignore
export const VEHICLE_SCHEMA_LITERAL = {
	title: 'vehicle schema',
	version: 0,
	description: 'Vechicle',
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: { type: 'string', primary: true, maxLength: 100 },
		nombreVehiculo: { type: 'string' },
		marca: { type: 'string' },
		modelo: { type: 'string' },
		color: { type: 'string' },
		year: { type: 'string' },
		cc: { type: 'string' },
		cv: { type: 'string' },
		icono: { type: 'string' },
		observaciones: { type: 'string' },
    mantenimientos: { type: 'array', items: MAINTENANCE_SCHEMA, default: [] }
	},
	required: ['id']
};

const schemaTyped = toTypedRxJsonSchema(VEHICLE_SCHEMA_LITERAL);
export type RxVehicleDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export const VEHICLE_SCHEMA: RxJsonSchema<RxVehicleDocumentType> = VEHICLE_SCHEMA_LITERAL;

export interface VehicleModel {
  id: string;
  nombreVehiculo: string;
  marca: string;
  modelo: string;
  color: string;
  year: string;
  cc: string;
  cv: string;
  icono: string;
  observaciones: string;
  mantenimientos: Maintenance[];
}
