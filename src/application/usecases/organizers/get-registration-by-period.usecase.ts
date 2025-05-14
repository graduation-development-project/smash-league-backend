import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TournamentRegistrationRepositoryPort } from "../../../domain/repositories/tournament-registration.repository.port";
import { GetRegistrationStatsInput } from "../../../domain/interfaces/interfaces";
import { ApiResponse } from "../../../domain/dtos/api-response";

@Injectable()
export class GetRegistrationCountByPeriodUseCase {
	constructor(
		@Inject("TournamentRegistrationRepositoryPort")
		private tournamentRegistrationRepository: TournamentRegistrationRepositoryPort,
	) {}

	async execute({
		organizerId,
		period,
		fromDate,
		toDate,
	}: GetRegistrationStatsInput): Promise<ApiResponse<Record<string, number>>> {
		return new ApiResponse<Record<string, number>>(
			HttpStatus.OK,
			"Get registration count by period successfully",
			await this.tournamentRegistrationRepository.getRegistrationCountByPeriod({
				organizerId,
				period,
				fromDate,
				toDate,
			}),
		);
	}
}
