export interface ICheckBankAccountRequest {
	account: string;
	bank: string;
}

export interface ICheckBankAccountResponse {
	code: string;
	success: boolean;
	data: ICheckOwnerResponse;
	msg: string;
}

export interface ICheckOwnerResponse {
	ownerName: string;
}