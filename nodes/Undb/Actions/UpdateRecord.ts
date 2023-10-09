import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { apiRequest } from '../GenericFunctions';

export async function executeUpdateRecord(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();

	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		const tableId = this.getNodeParameter('tableId', i) as string;
		const recordId = this.getNodeParameter('recordId', i) as string;
		const dataToSend = this.getNodeParameter('dataToSend', i) as 'defineBelow' | 'autoMapInputData';

		const endpoint = `/api/v1/openapi/tables/${tableId}/records/${recordId}`;

		const values: IDataObject = {};

		// user defined data
		if (dataToSend === 'defineBelow') {
			const fields = this.getNodeParameter('fieldsUi.fieldValues', i, []) as Array<{
				fieldName: string;
				fieldValue?: string;
			}>;

			for (const field of fields) {
				values[field.fieldName] = field.fieldValue;
			}
		}

		// use previous input data
		else if (dataToSend === 'autoMapInputData') {
			const data = items[i].json;
			Object.assign(values, data);
		}

		// make create record request
		if (Object.keys(values).length) {
			const responseData = await apiRequest.call(this, 'PATCH', endpoint, { values });

			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData as IDataObject),
				{ itemData: { item: i } },
			);

			returnData.push(...executionData);
		}
	}

	return this.prepareOutputData(returnData);
}
