import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TournamentRepositoryPort } from "../../../domain/repositories/tournament.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { Tournament } from "@prisma/client";

@Injectable()
export class CountNumberTourInCurrentMonthUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
	) {}

	async execute(organizerId: string): Promise<
		ApiResponse<{
			currentCount: number;
			previousCount: number;
			changeRate: number;
		}>
	> {
		return new ApiResponse<{
			currentCount: number;
			previousCount: number;
			changeRate: number;
		}>(
			HttpStatus.OK,
			"Get number of tour in current month Successfully",
			await this.tournamentRepository.countNumberOfTourInCurrentMonth(
				organizerId,
			),
		);
	}
}
