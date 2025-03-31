import { HttpStatus } from "@nestjs/common";
import { TournamentSerie } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IModifyTournamentSerie } from "src/domain/interfaces/tournament-serie/tournament-serie.interface";
import { ModifyTournamentSerie } from "src/domain/interfaces/tournament-serie/tournament-serie.validation";
import { TournamentSerieRepositoryPort } from "src/domain/interfaces/repositories/tournament-serie.repository.port";

export class ModifyTournamentSerieUseCase {
	constructor(
		private readonly tournamentSerieRepository: TournamentSerieRepositoryPort
	) {
	}

	async execute(modifyTournamentSerie: ModifyTournamentSerie) : Promise<ApiResponse<TournamentSerie>> {
		return new ApiResponse<TournamentSerie>(
			HttpStatus.NO_CONTENT,
			"Update successful!",
			await this.tournamentSerieRepository.modifyTournamentSerie({
				...modifyTournamentSerie
			})
		);
	}
}