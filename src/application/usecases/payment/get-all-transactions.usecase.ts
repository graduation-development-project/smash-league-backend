import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TransactionRepositoryPort } from "../../../domain/repositories/transaction.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { Transaction } from "@prisma/client";

@Injectable()
export class GetAllTransactionsUseCase {
	constructor(
		@Inject("TransactionRepository")
		private readonly transactionRepository: TransactionRepositoryPort,
	) {}

	async execute(): Promise<ApiResponse<Transaction[]>> {
		return new ApiResponse<Transaction[]>(
			HttpStatus.OK,
			"Get all transactions successfully",
			await this.transactionRepository.getAllTransactions(),
		);
	}
}
