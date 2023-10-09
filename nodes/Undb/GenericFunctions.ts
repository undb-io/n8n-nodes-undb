import type { OptionsWithUri } from 'request';

import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IPollFunctions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * Make an API request to Undb
 *
 */
export async function apiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
	method: string,
	endpoint: string,
	body: object,
	query?: IDataObject,
	uri?: string,
	option: IDataObject = {},
): Promise<any> {
	const authenticationMethod = this.getNodeParameter('authentication', 0) as number;
	const auth = authenticationMethod === 0 ? 'undbApi' : String(authenticationMethod);
	const credentials = await this.getCredentials(auth);

	if (credentials === undefined) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}

	const baseUrl = credentials.host as string;

	query = query || {};

	const options: OptionsWithUri = {
		method,
		body,
		qs: query,
		uri:
			uri || baseUrl.endsWith('/') ? `${baseUrl.slice(0, -1)}${endpoint}` : `${baseUrl}${endpoint}`,
		json: true,
	};

	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	return this.helpers.requestWithAuthentication.call(this, auth, options);
}
