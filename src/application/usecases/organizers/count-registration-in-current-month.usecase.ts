import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TournamentRegistrationRepositoryPort } from "../../../domain/repositories/tournament-registration.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";

@Injectable()
export class CountRegistrationInCurrentMonthUseCase {
	constructor(
		@Inject("TournamentRegistrationRepositoryPort")
		private readonly tournamentRegistrationRepository: TournamentRegistrationRepositoryPort,
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
			"Get number of matches in current week Successfully",
			await this.tournamentRegistrationRepository.countNumberOfRegistrationsInCurrentMonth(
				organizerId,
			),
		);
	}
}
