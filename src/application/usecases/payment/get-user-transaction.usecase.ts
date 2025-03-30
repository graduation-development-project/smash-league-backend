import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { TransactionRepositoryPort } from "../../../domain/repositories/transaction.repository.port";
import { Transaction } from "@prisma/client";

@Injectable()
export class GetUserTransactionUseCase {
	constructor(
		@Inject("TransactionRepository")
		private readonly transactionRepository: TransactionRepositoryPort,
	) {}

	async execute(userId: string): Promise<ApiResponse<Transaction[]>> {
		return new ApiResponse<Transaction[]>(
			HttpStatus.OK,
			"Get user transactions successfully",
			await this.transactionRepository.getTransactionByUserId(userId),
		);
	}
}
