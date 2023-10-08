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
		typeOptions: {
			loadOptionsMethod: 'getTables',
		},
	},
	{
		displayName: 'Record ID',
		name: 'recordId',
		type: 'string',
		default: '',
		required: true,
		description: 'The value of the ID',
		displayOptions: {
			show: {
				operation: ['delete', 'get', 'update'],
			},
		},
	},
	{
		displayName: 'Data to Send',
		name: 'dataToSend',
		type: 'options',
		options: [
			{
				name: 'Auto-Map Input Data to Feilds',
				value: 'autoMapInputData',
				description: 'Use when node input properties match destination field names',
			},
			{
				name: 'Define Below for Each Field',
				value: 'defineBelow',
				description: 'Set the value for each destination field',
			},
		],
		displayOptions: {
			show: {
				operation: ['create', 'update'],
			},
		},
		default: 'defineBelow',
		description: 'Whether to insert the input data this node receives in the new row',
	},
	{
		displayName: 'Fields to Send',
		name: 'fieldsUi',
		placeholder: 'Add Field',
		type: 'fixedCollection',
		typeOptions: {
			multipleValueButtonText: 'Add Field to Send',
			multipleValues: true,
		},
		displayOptions: {
			show: {
				operation: ['create', 'update'],
				dataToSend: ['defineBelow'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Field',
				name: 'fieldValues',
				values: [
					{
						displayName: 'Field Name',
						name: 'fieldName',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'Field Value',
						name: 'fieldValue',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
];
