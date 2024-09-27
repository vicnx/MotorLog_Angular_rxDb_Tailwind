export const CUSTOMSERVICE_SCHEMA = {
	type: 'object',
	properties: {
		id: { type: 'number' },
		label: { type: 'string', nullable: true },
		value: { type: 'string', nullable: true },
		icon: { type: 'string', nullable: true },
		color: { type: 'string', nullable: true }
	},
	required: []
};

export interface CustomService {
	id: number;
	label: string;
	value: string;
	icon: string;
	color: string;
}
