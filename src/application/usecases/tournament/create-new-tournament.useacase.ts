import { Inject, Injectable } from "@nestjs/common";
import { TournamentSerie } from "@prisma/client";
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
			const tournament = await this.createTournament(createTournament, tournamentSerie);
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

	async createTournament(createTournament: CreateTournament, tournamentSerie: TournamentSerie) {
		const tournament = await this.tournamentRepository.createTournament({
			id: createTournament.id,
			name: createTournament.name,
			shortName: createTournament.shortName,
			registrationOpeningDate: createTournament.registrationOpeningDate,
			registrationClosingDate: createTournament.registrationClosingDate,
			backgroundTournament: createTournament.backgroundTournament,
			checkInBeforeStart: createTournament.checkInBeforeStart,
			drawDate: createTournament.drawDate,
			endDate: createTournament.endDate,
			startDate: createTournament.startDate,
			registrationFeePerPerson: createTournament.registrationFeePerPerson,
			registrationFeePerPair: createTournament.registrationFeePerPair,
			maxEventPerPerson: createTournament.maxEventPerPerson,
			prizePool: createTournament.prizePool,
			mainColor: createTournament.mainColor,
			umpirePerMatch: createTournament.umpirePerMatch,
			protestFeePerTime: createTournament.protestFeePerTime,
			hasMerchandise: createTournament.hasMerchandise,
			merchandise: createTournament.merchandise,
			numberOfMerchandise: createTournament.numberOfMerchandise,
			merchandiseImageContent: createTournament.merchandiseImageContent,
			location: createTournament.location,
			requiredAttachment: createTournament.requiredAttachment,
			tournamentSerieId: tournamentSerie.id
		});
		console.log(tournament);
	}
}