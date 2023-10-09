import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { apiRequest } from '../GenericFunctions';

export async function executeGetRecords(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();

	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		const tableId = this.getNodeParameter('tableId', i) as string;

		const endPoint = `/api/v1/openapi/tables/${tableId}/records`;

		const responseData = await apiRequest.call(this, 'GET', endPoint, {});

		const executionData = this.helpers.constructExecutionMetaData(
			this.helpers.returnJsonArray(responseData.records as IDataObject),
			{ itemData: { item: i } },
		);

		returnData.push(...executionData);
	}

	return this.prepareOutputData(returnData);
}
