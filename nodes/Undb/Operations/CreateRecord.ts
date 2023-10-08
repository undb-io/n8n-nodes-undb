import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { apiRequest } from '../GenericFunctions';

export async function executeCreateRecord(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();

	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		const tableId = this.getNodeParameter('tableId', i);

		const endpoint = `/api/v1/openapi/tables/${tableId}/records`;

		const fields = this.getNodeParameter('fieldsUi.fieldValues', i, []) as Array<{
			fieldName: string;
			fieldValue?: string;
		}>;

		const values: IDataObject = {};
		for (const field of fields) {
			values[field.fieldName] = field.fieldValue;
		}

		const responseData = await apiRequest.call(this, 'POST', endpoint, { values });

		const executionData = this.helpers.constructExecutionMetaData(
			this.helpers.returnJsonArray(responseData as IDataObject),
			{ itemData: { item: i } },
		);

		returnData.push(...executionData);
	}

	return this.prepareOutputData(returnData);
}
