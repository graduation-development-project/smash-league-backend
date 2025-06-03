import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TransactionRepositoryPort } from "../../../domain/repositories/transaction.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";

@Injectable()
export class CountAllTransactionUseCase {
	constructor(
		@Inject("TransactionRepository")
		private readonly transactionRepository: TransactionRepositoryPort,
	) {}

	async execute(): Promise<ApiResponse<{ count: number; total: number }>> {
		return new ApiResponse<{ count: number; total: number }>(
			HttpStatus.OK,
			"Count all transaction successfully",
			await this.transactionRepository.countAllTransactions(),
		);
	}
}
