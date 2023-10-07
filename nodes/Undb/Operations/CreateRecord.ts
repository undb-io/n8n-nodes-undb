import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export async function executeCreateRecord(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	console.log('items', items);

	return this.prepareOutputData([]);
}
