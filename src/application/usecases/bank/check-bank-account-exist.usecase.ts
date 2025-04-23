import { BankAccountCheckRequest } from './../../../domain/interfaces/bank/bank-account.validation';
import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ICheckBankAccountResponse } from 'src/domain/interfaces/bank/bank-account.interface';
import { BankLookUpService } from "src/infrastructure/services/bank-lookup.service";

@Injectable()
export class CheckBankAccountExistUseCase {
	constructor(
		private readonly bankLookUpService: BankLookUpService
	){
	}

	async execute(checkBankAccountExistRequest: BankAccountCheckRequest): Promise<ApiResponse<any>> {
		const checkBankAccount = await this.bankLookUpService.bankLookUpAccount({
			...checkBankAccountExistRequest
		});
		if (checkBankAccount.success === false) return new ApiResponse<ICheckBankAccountResponse>(
			HttpStatus.NOT_FOUND,
			"Bank account not found!",
			checkBankAccount
		);
		return new ApiResponse<ICheckBankAccountResponse>(
			HttpStatus.OK,
			"Bank account found!",
			checkBankAccount
		);
	}
}