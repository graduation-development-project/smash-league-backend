import { HttpStatus, Inject } from "@nestjs/common";
import { TournamentSerie } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { TournamentSerieRepositoryPort } from "src/domain/repositories/tournament-serie.repository.port";

export class GetTournamentsOfTournamentSerieUseCase {
	constructor(
		@Inject("TournamentSerieRepository") private readonly tournamentSerieRepository: TournamentSerieRepositoryPort
	) {
	}

	async execute(id: string) : Promise<ApiResponse<TournamentSerie>> {
		const tournamentSerie = await this.tournamentSerieRepository.getAllTournamentOfTournamentSerie(id);
		if (tournamentSerie === null) {
			return new ApiResponse<null | undefined>(
				HttpStatus.NOT_FOUND,
				"Not found any tournament serie",
				null
			);
		}
		return new ApiResponse<TournamentSerie>(
			HttpStatus.OK,
			"Get all tournaments of a serie successfully!",
			tournamentSerie
		);
	}
}