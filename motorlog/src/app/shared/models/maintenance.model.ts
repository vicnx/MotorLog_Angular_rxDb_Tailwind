export const MAINTENANCE_SCHEMA = {
  type: 'object',
  properties: {
      date: { type: 'string', format: 'date-time', nullable: true },
      odometer: { type: 'number', default: 0 },
      serviceType: { type: 'string', nullable: true },
      location: { type: 'string', nullable: true },
      amount: { type: 'number', nullable: true },
      notes: { type: 'string', default: '' }
  },
  required: []
};

export interface Maintenance {
  id:number;
  date: string;
  odometer: number;
  serviceType: any | null;
  location: string | null;
  amount: number | null;
  notes: string;
  title?:string;
}
