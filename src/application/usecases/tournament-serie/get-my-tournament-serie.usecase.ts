import { HttpStatus, Inject } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IRequestUser } from "src/domain/interfaces/interfaces";
import { ITournamentSerieResponse } from "src/domain/interfaces/tournament-serie/tournament-serie.interface";
import { TournamentSerieRepositoryPort } from "src/domain/interfaces/repositories/tournament-serie.repository.port";

export class GetMyTournamentSerieUseCase {
	constructor(
		@Inject("TournamentSerieRepository") 
		private readonly tournamentSerieRepository: TournamentSerieRepositoryPort
	) {
	}

	async execute(request: IRequestUser) : Promise<ApiResponse<any>> {
		const tournamentSeries = await this.tournamentSerieRepository.getTournamentSerieByUserId(request.user.id);
		if (tournamentSeries.length === 0) return new ApiResponse<null | undefined>(
			HttpStatus.NOT_FOUND, 
			"No tournament series of user found!",
			null
		);
		return new ApiResponse<ITournamentSerieResponse[]>(
			HttpStatus.OK,
			"Get all tournament serie by user successful!",
			tournamentSeries
		);
	}
}