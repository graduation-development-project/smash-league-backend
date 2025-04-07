import { Controller, Get } from "@nestjs/common";
import { GetAllBanksUseCase } from "../../application/usecases/bank/get-all-banks.usecase";
import { ApiResponse } from "../../domain/dtos/api-response";
import { Bank } from "@prisma/client";

@Controller("banks")
export class BankController {
	constructor(private readonly getAllBanksUseCase: GetAllBanksUseCase) {}

	@Get("/")
	async getBankList(): Promise<ApiResponse<Bank[]>> {
		return this.getAllBanksUseCase.execute();
	}
}
