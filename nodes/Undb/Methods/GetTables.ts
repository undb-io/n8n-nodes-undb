import { IDataObject, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { apiRequest } from '../GenericFunctions';

export async function getTables(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const responseData = await apiRequest.call(this, 'GET', '/api/v1/openapi/tables', {});

	return responseData.tables.map((table: IDataObject) => ({
		name: table.name,
		value: table.id,
	}));
}

export async function getViews(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const tableId = this.getNodeParameter('tableId', 0);
	if (!tableId) return [];

	const responseData = await apiRequest.call(this, 'GET', `/api/v1/openapi/tables/${tableId}`, {});

	return (
		responseData.table?.views.map((view: IDataObject) => ({
			name: view.name,
			value: view.id,
		})) ?? []
	);
}
