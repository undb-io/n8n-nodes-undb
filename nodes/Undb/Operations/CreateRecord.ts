import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export async function executeCreateRecord(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[][]> {
	return this.prepareOutputData([]);
}
