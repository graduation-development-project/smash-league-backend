import { HttpStatus, Inject } from "@nestjs/common";
import { TournamentSerie } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { TournamentSerieRepositoryPort } from "src/domain/repositories/tournament-serie.repository.port";

export class GetAllTournamentSeriesUseCase {
	constructor(
		@Inject("TournamentSerieRepository") private readonly tournamentSerieRepository: TournamentSerieRepositoryPort
	) {
		
	}

	async execute() : Promise<ApiResponse<TournamentSerie[]>> {
		const tournamentSeries = await this.tournamentSerieRepository.getTournamentSeries();
		if (tournamentSeries.length === 0) return new ApiResponse<null | undefined>(
			HttpStatus.NOT_FOUND,
			"No tournament series found!",
			null
		);
		return new ApiResponse<TournamentSerie[]>(
			HttpStatus.OK,
			"Get all tournament successful!",
			tournamentSeries
		);
	}

}