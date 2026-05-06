export const CUSTOMLOCATION_SCHEMA = {
	type: 'object',
	properties: {
		id: { type: 'number' },
		label: { type: 'string', nullable: true },
		value: { type: 'string', nullable: true }
	},
	required: []
};

export interface CustomLocation {
	id: number;
	label: string;
	value: string;
}
