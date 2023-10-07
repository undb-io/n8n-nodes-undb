import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { apiRequest } from '../GenericFunctions';

export async function executeGetRecords(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const tableId = this.getNodeParameter('tableId', 0) as string;

	const returnData: INodeExecutionData[] = [];

	const endPoint = `/api/v1/openapi/tables/${tableId}/records`;

	for (let i = 0; i < items.length; i++) {
		const responseData = await apiRequest.call(this, 'GET', endPoint, {});

		const executionData = this.helpers.constructExecutionMetaData(
			this.helpers.returnJsonArray(responseData as IDataObject),
			{ itemData: { item: i } },
		);

		returnData.push(...executionData);
	}

	return this.prepareOutputData(returnData);
}
