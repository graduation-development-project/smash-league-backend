import { HttpStatus, Inject } from "@nestjs/common";
import { TournamentSerie } from "@prisma/client";
import { create } from "domain";
import { ApiResponse } from "src/domain/dtos/api-response";
import { CreateTournamentSerie } from "src/domain/interfaces/tournament-serie/tournament-serie.validation";
import { TournamentSerieRepositoryPort } from "src/domain/repositories/tournament-serie.repository.port";

export class CreateTournamentSerieUseCase {
	constructor(
		@Inject("TournamentSerieRepository") private readonly tournamentSerieRepository: TournamentSerieRepositoryPort
	) {
	}

	async execute(createTournamentSerie: CreateTournamentSerie) : Promise<ApiResponse<TournamentSerie>> {
		const isExist = await this.tournamentSerieRepository.getTournamentSerieByName(createTournamentSerie.tournamentSerieName) !== null;
		if (isExist) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Tournament Serie exist!",
			null
		);
		return new ApiResponse<TournamentSerie>(
			HttpStatus.CREATED,
			"Create tournament successful!",
			await this.tournamentSerieRepository.createTournamentSerieOnly({
				...createTournamentSerie
			})
		);
	}
}