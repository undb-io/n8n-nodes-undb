import {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { apiRequest } from './GenericFunctions';
import { getTables } from './Methods/GetTables';

export class UndbTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Undb Trigger',
		name: 'undbTrigger',
		icon: 'file:undb.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Handle Undb events via webhooks',
		defaults: {
			name: 'Undb Trigger',
		},
		inputs: [],
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
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
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
				displayName: 'Table Name or ID',
				name: 'tableId',
				type: 'options',
				default: '',
				required: true,
				description:
					'The ID of the table. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'getTables',
				},
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'record.created',
				options: [
					{
						name: 'Record All Event',
						value: 'record.*',
					},
					{
						name: 'Record Bulk Created',
						value: 'record.bulk_created',
					},
					{
						name: 'Record Bulk Deleted',
						value: 'record.bulk_deleted',
					},
					{
						name: 'Record Bulk Updated',
						value: 'record.bulk_updated',
					},
					{
						name: 'Record Created',
						value: 'record.created',
					},
					{
						name: 'Record Deleted',
						value: 'record.deleted',
					},
					{
						name: 'Record Updated',
						value: 'record.updated',
					},
				],
				description: 'The event to listen to',
			},
		],
	};

	methods = {
		loadOptions: {
			getTables,
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const tableId = this.getNodeParameter('tableId') as string;

				const endpoint = `/api/v1/openapi/tables/${tableId}/webhooks/${webhookData.webhookId}`;
				const { webhook } = await apiRequest.call(this, 'GET', endpoint, {});
				if (!webhook) return false;

				if (webhook.url === webhookUrl && webhook.event === event) {
					webhookData.webhookId = webhook.id;
					return true;
				}
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');

				const tableId = this.getNodeParameter('tableId') as string;
				const event = this.getNodeParameter('event') as string;

				const endpoint = `/api/v1/openapi/tables/${tableId}/webhooks`;

				const body: IDataObject = {
					enabled: true,
					method: 'POST',
					url: webhookUrl,
					name: this.getWorkflow().name,
					event,
					headers: {},
					target: {
						id: tableId,
						type: 'table',
						event,
					},
				};
				const webhook = await apiRequest.call(this, 'POST', endpoint, body);

				webhookData.webhookId = webhook.id;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const tableId = this.getNodeParameter('tableId') as string;

				const endpoint = `/api/v1/openapi/tables/${tableId}/webhooks/${webhookData.webhookId}`;

				try {
					await apiRequest.call(this, 'DELETE', endpoint, {});
				} catch (error) {
					return false;
				}
				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		const returnData: IDataObject[] = [];

		returnData.push({
			body: bodyData,
		});

		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)],
		};
	}
}
