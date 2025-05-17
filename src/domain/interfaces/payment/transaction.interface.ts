export interface ICreateTransactionRequest {
	userId: string;
	transactionDetail: string;
	orderId?: string;
	tournamentRegistrationId?: string;
	reportId?: string;
	value: number;
}

export interface ICreatePaybackTransactionRequest {
	userId: string;
	transactionDetail: string;
	value: number;
	paybackToUserId: string;
	paybackImage: string;
	paybackFeeId: string;
}
