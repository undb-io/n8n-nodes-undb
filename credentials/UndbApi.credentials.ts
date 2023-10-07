import type { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

export class UndbApi implements ICredentialType {
	name = 'undbApi';

	displayName = 'Undb API';

	documentationUrl = 'https://docs.undb.xyz/openapi/1tokens/';

	properties: INodeProperties[] = [
		{
			displayName: 'Api Token',
			name: 'apiToken',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
		},
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: '',
			placeholder: 'http(s)://localhost:3000',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-undb-api-token': '={{$credentials.apiToken}}',
			},
		},
	};
}
