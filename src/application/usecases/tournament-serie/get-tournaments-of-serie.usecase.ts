import { HttpStatus, Inject } from "@nestjs/common";
import { Tournament, TournamentSerie } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IPaginatedOutput, IPaginateOptions } from "src/domain/interfaces/interfaces";
import { TournamentSerieRepositoryPort } from "src/domain/interfaces/repositories/tournament-serie.repository.port";

export class GetTournamentsOfTournamentSerieUseCase {
	constructor(
		@Inject("TournamentSerieRepository") private readonly tournamentSerieRepository: TournamentSerieRepositoryPort
	) {
	}

	async execute(id: string, options: IPaginateOptions) : Promise<ApiResponse<IPaginatedOutput<Tournament>>> {
		const data = await this.tournamentSerieRepository.queryTournamentByTournamentSerie(id, options);
		if (data.data.length === 0) {
			return new ApiResponse<null | undefined>(
				HttpStatus.NOT_FOUND,
				"Not found any tournament serie",
				null
			);
		}
		return new ApiResponse<IPaginatedOutput<Tournament>>(
			HttpStatus.OK,
			"Get all tournaments of a serie successfully!",
			data
		);
	}
}