export interface ICreateTransactionRequest {
	transactionDetail: string;
	orderId?: string;
	tournamentRegistrationId?: string;
	value: number;
}

export interface ICreatePaybackTransactionRequest {
	transactionDetail: string;
	value: number;
	paybackToUserId: string;
	paybackImage: string;
}
