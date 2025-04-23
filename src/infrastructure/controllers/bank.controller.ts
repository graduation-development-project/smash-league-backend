import { Body, Controller, Get, Post } from "@nestjs/common";
import { GetAllBanksUseCase } from "../../application/usecases/bank/get-all-banks.usecase";
import { ApiResponse } from "../../domain/dtos/api-response";
import { Bank } from "@prisma/client";
import { CheckBankAccountExistUseCase } from "src/application/usecases/bank/check-bank-account-exist.usecase";
import { BankAccountCheckRequest } from "src/domain/interfaces/bank/bank-account.validation";

@Controller("banks")
export class BankController {
	constructor(
		private readonly getAllBanksUseCase: GetAllBanksUseCase,
		private readonly checkBankAccountExistUseCase: CheckBankAccountExistUseCase
	) {}

	@Get("/")
	async getBankList(): Promise<ApiResponse<Bank[]>> {
		return this.getAllBanksUseCase.execute();
	}

	@Post("/check-bank-account")
	async checkBankAccountExist(@Body() checkBankAccountRequest: BankAccountCheckRequest): Promise<ApiResponse<any>> {
		return await this.checkBankAccountExistUseCase.execute(checkBankAccountRequest);
		// console.log(checkBankAccountRequest);
		return;
	}
}
