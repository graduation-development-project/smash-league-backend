import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Tournament } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";

@Injectable()
export class GetFeatureTournamentsUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
	) {}

	async execute(): Promise<ApiResponse<Tournament[]>> {
		return new ApiResponse<Tournament[]>(
			HttpStatus.OK,
			"Get feature tournaments successful!",
			await this.tournamentRepository.getFeatureTournaments(),
		);
	}
}
