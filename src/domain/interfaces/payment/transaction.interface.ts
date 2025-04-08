export interface ICreateTransactionRequest {
	userId: string;
	transactionDetail: string;
	orderId?: string;
	tournamentRegistrationId?: string;
	value: number;
}

export interface ICreatePaybackTransactionRequest {
	userId: string;
	transactionDetail: string;
	value: number;
	paybackToUserId: string;
	paybackImage: string;
}
