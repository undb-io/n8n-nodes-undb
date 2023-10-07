import type { INodeProperties } from 'n8n-workflow';

export const operationFields: INodeProperties[] = [
	// ----------------------------------
	//         Shared
	// ----------------------------------
	{
		displayName: 'Table ID',
		name: 'tableId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the table',
	},
];
