export interface ICreateTransactionRequest {
	transactionDetail: string;
	orderId?: string;
	tournamentRegistrationId?: string;
	value: number;
}
