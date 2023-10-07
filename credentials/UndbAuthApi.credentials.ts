import type { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

export class UndbAuthApi implements ICredentialType {
	name = 'undbAuthApi';

	displayName = 'Undb Auth API';

	documentationUrl = 'https://docs.undb.xyz/openapi/1tokens/';

	properties: INodeProperties[] = [
		{
			displayName: 'Auth Api Token',
			name: 'authApiToken',
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
				Authorization: '=Bearer {{$credentials.authApiToken}}',
			},
		},
	};
}
