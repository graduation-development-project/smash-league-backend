import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Tournament } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IUpdateTournamentInformation } from "src/domain/interfaces/tournament/tournament.interface";
import { UpdateTournamentInformation } from "src/domain/interfaces/tournament/tournament.validation";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";
@Injectable()
export class UpdateTournamentInformationUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort
	) {
	}

	async execute(updateTournament: UpdateTournamentInformation): Promise<ApiResponse<Tournament>> {
		const tournament = await this.tournamentRepository.getTournament(updateTournament.id);
		if (tournament === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Tournament not found!",
			null
		);
		return new ApiResponse<Tournament>(
			HttpStatus.NO_CONTENT,
			"Update tournament information successful!",
			await this.tournamentRepository.updateTournamentInformation({
				...updateTournament
			})
		);
	}
}