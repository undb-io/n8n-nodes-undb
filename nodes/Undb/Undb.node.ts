import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeExecutionWithMetadata,
	NodeOperationError,
} from 'n8n-workflow';
import { executeCreateRecord } from './Actions/CreateRecord';
import { executeDeleteRecord } from './Actions/DeleteRecord';
import { executeGetRecord } from './Actions/GetRecord';
import { executeGetRecords } from './Actions/GetRecords';
import { executeUpdateRecord } from './Actions/UpdateRecord';
import { getTables, getViews } from './Methods/GetTables';
import { operationFields } from './OperationDescription';

export class Undb implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Undb',
		name: 'undb',
		icon: 'file:undb.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Undb API',
		defaults: {
			name: 'Undb',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'undbApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['undbApi'],
					},
				},
			},
			{
				name: 'undbAuthApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['undbAuthApi'],
					},
				},
			},
		],
		requestDefaults: {
			baseURL: 'https://demo.undb.com',
			url: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		/**
		 * In the properties array we have two mandatory options objects required
		 *
		 * [Resource & Operation]
		 *
		 * https://docs.n8n.io/integrations/creating-nodes/code/create-first-node/#resources-and-operations
		 *
		 * In our example, the operations are separated into their own file (HTTPVerbDescription.ts)
		 * to keep this class easy to read.
		 *
		 */
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Api Token',
						value: 'undbApi',
					},
					{
						name: 'Auth Api Token',
						value: 'undbAuthApi',
					},
				],
				default: 'undbApi',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Record',
						value: 'record',
					},
				],
				default: 'record',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['record'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a record',
						action: 'Create a record',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a record',
						action: 'Delete a record',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Retrieve a record',
						action: 'Get a record',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Retrieve many records',
						action: 'Get many records',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a record',
						action: 'Update a record',
					},
				],
				default: 'get',
			},
			...operationFields,
		],
	};

	methods = {
		loadOptions: {
			getTables,
			getViews,
		},
	};

	async execute(
		this: IExecuteFunctions,
	): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
		const operation = this.getNodeParameter('operation', 0);
		if (operation === 'create') {
			return executeCreateRecord.call(this);
		}

		if (operation === 'update') {
			return executeUpdateRecord.call(this);
		}

		if (operation === 'get') {
			return executeGetRecord.call(this);
		}

		if (operation === 'getMany') {
			return executeGetRecords.call(this);
		}

		if (operation === 'delete') {
			return executeDeleteRecord.call(this);
		}

		throw new NodeOperationError(this.getNode(), `Invalid operation ${operation}`);
	}
}
