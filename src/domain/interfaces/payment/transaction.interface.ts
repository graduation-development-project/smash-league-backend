export interface ICreateTransactionRequest {
	transactionDetail: string;
	orderId?: number;
	tournamentRegistrationId?: string;
	value: number;
}
