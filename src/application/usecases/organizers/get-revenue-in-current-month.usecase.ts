import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TournamentRegistrationRepositoryPort } from "../../../domain/repositories/tournament-registration.repository.port";
import { GetRegistrationStatsInput } from "../../../domain/interfaces/interfaces";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { TransactionRepositoryPort } from "../../../domain/repositories/transaction.repository.port";

@Injectable()
export class GetRevenueInCurrentMonthUseCase {
	constructor(
		@Inject("TransactionRepository")
		private transactionRepository: TransactionRepositoryPort,
	) {}

	async execute(organizerId: string): Promise<
		ApiResponse<{
			currentRevenue: number;
			previousRevenue: number;
			changeRate: number;
		}>
	> {
		return new ApiResponse<{
			currentRevenue: number;
			previousRevenue: number;
			changeRate: number;
		}>(
			HttpStatus.OK,
			"Get revenue in current month successfully",
			await this.transactionRepository.getRevenueInCurrentMonth(organizerId),
		);
	}
}
