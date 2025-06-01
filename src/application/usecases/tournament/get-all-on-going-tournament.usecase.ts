import { HttpStatus, Inject } from "@nestjs/common";
import { TournamentRepositoryPort } from "../../../domain/repositories/tournament.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";

export class GetAllOnGoingTournamentUseCase {
	constructor(
		@Inject("TournamentRepository")
		private tournamentRepository: TournamentRepositoryPort,
	) {}

	async execute(): Promise<ApiResponse<{ all: number; thisWeek: number }>> {
		return new ApiResponse(
			HttpStatus.OK,
			"Get all ongoing tournament successfully",
			await this.tournamentRepository.getAllOnGoingTournament(),
		);
	}
}
