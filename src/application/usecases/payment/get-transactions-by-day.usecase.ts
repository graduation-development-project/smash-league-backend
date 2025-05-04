import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TransactionRepositoryPort } from "../../../domain/repositories/transaction.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";

@Injectable()
export class GetTransactionsByDayUseCase {
	constructor(
		@Inject("TransactionRepository")
		private readonly transactionRepository: TransactionRepositoryPort,
	) {}

	async execute(): Promise<ApiResponse<{ date: string; total: number }[]>> {
		const txns = await this.transactionRepository.getAllTransactionsByDay();

		const grouped = txns.reduce(
			(acc, txn) => {
				const dateKey = txn.createdAt.toISOString().split("T")[0];
				acc[dateKey] = (acc[dateKey] || 0) + txn.value;
				return acc;
			},
			{} as Record<string, number>,
		);

		const returnData = Object.entries(grouped).map(([date, total]) => ({
			date,
			total,
		}));

		return new ApiResponse<{ date: string; total: number }[]>(
			HttpStatus.OK,
			"Get transactions by day successfully",
			returnData,
		);
	}
}
