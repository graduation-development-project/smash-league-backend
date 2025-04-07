import { HttpStatus, Inject } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { BankRepositoryPort } from "../../../domain/repositories/bank.repository.port";
import { Bank } from "@prisma/client";

export class GetAllBanksUseCase {
	constructor(
		@Inject("BankRepositoryPort") private bankRepository: BankRepositoryPort,
	) {}

	async execute(): Promise<ApiResponse<Bank[]>> {
		return new ApiResponse<Bank[]>(
			HttpStatus.OK,
			"Get banks list successfully",
			await this.bankRepository.getAllBankList(),
		);
	}
}
