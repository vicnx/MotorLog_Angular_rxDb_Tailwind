export const MAINTENANCE_SCHEMA = {
  type: 'object',
  properties: {
      date: { type: 'string', format: 'date-time', nullable: true },
      odometer: { type: 'number', default: 0 },
      serviceType: { type: 'string', nullable: true },
      location: { type: 'string', nullable: true },
      amount: { type: 'number', nullable: true },
      notes: { type: 'string', default: '' },
      description: { type: 'string', default: '' }
  },
  required: []
};

export interface ServiceTypeItem {
  id?: number | string;
  label?: string;
  value?: string;
  color?: string;
  icon?: string;
}

export interface Maintenance {
  id: number | string;
  date: string | Date;
  odometer: number;
  serviceType: ServiceTypeItem[];
  location: string | null;
  amount: number | null;
  notes: string;
  description: string;
  title?: string;
}
