import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TournamentRepositoryPort } from "../../../domain/repositories/tournament.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { Tournament } from "@prisma/client";

@Injectable()
export class GetLatestFinishTournamentUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
	) {}

	async execute(limit: number = 10): Promise<ApiResponse<Tournament[]>> {
		return new ApiResponse<Tournament[]>(
			HttpStatus.OK,
			"Get Latest Finished Tournaments Successfully",
			await this.tournamentRepository.getLatestFinishTournament(limit),
		);
	}
}
