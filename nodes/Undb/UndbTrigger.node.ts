import {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { apiRequest } from './GenericFunctions';

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
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'record.created',
				options: [
					{
						name: 'Record Added',
						value: 'record.created',
					},
				],
			},
		],
	};

	// @ts-ignore
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const endpoint = `/api/v1/openapi/tables/{tableId}/records`;
				const { hooks: webhooks } = await apiRequest.call(this, 'GET', endpoint, {});
				for (const webhook of webhooks) {
					if (webhook.target_url === webhookUrl && webhook.event === event) {
						webhookData.webhookId = webhook.hook_id;
						return true;
					}
				}
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');
				const event = this.getNodeParameter('event') as string;
				const body: IDataObject = {
					event,
					target_url: webhookUrl,
				};
				const webhook = await apiRequest.call(this, 'POST', '/hook', body);
				webhookData.webhookId = webhook.hook_id;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				try {
					await apiRequest.call(this, 'DELETE', `/hook/${webhookData.webhookId}`, {});
				} catch (error) {
					return false;
				}
				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		return {
			workflowData: [],
		};
	}
}
