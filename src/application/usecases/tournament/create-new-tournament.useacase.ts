import { Inject, Injectable } from "@nestjs/common";
import { create } from "domain";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ICreateTournament } from "src/domain/interfaces/tournament/tournament.interface";
import { CreateTournament } from "src/domain/interfaces/tournament/tournament.validation";
import { TournamentSerieRepositoryPort } from "src/domain/repositories/tournament-serie.repository.port";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";

@Injectable()
export class CreateNewTournamentUseCase {
	constructor(
		@Inject("TournamentRepository") private readonly tournamentRepository: TournamentRepositoryPort,
		@Inject("TournamentSerieRepository") private readonly tournamentSerieRepository: TournamentSerieRepositoryPort
	) {}

	async execute(createTournament: CreateTournament) : Promise<ApiResponse<any>> {
		if (createTournament.tournamentSerieId === null) {
			const tournamentSerie = await this.tournamentSerieRepository.createTournamentSerie({
				...createTournament.createTournamentSerie,
			});
			// const tournament = await this.tournamentRepository.createTournament({
			// 	id: createTournament.id,
			// 	name: createTournament.name,
			// 	shortName: createTournament.shortName,
			// 	registrationOpeningDate: createTournament.registrationOpeningDate,
			// 	registrationClosingDate: createTournament.registrationClosingDate,
			// 	backgroundTournament: createTournament.backgroundTournament,

			// });
			// console.log(tournament);
		}
		return null;
		// return new ApiResponse<any>(
		// 	200, 
		// 	"Create tournament successfully!",
		// 	await this.tournamentRepository.createTournament({
		// 		...createTournament
		// 	})
		// );
	}

	createTournament(createTournament: ICreateTournament) {
		
	}
}