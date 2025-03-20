export interface ICreateTransactionRequest {
	transactionDetail: string;
	orderId: number;
	value: number;
	transactionPaymentLink: string;
	transactionImage: string;
}