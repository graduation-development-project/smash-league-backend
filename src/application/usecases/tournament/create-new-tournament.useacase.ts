import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Tournament, TournamentSerie, User } from "@prisma/client";
import { create } from "domain";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IRequestUser } from "src/domain/interfaces/interfaces";
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

	async execute(request: IRequestUser, createTournament: CreateTournament) : Promise<ApiResponse<any>> {
		console.log(request.user);
		var tournament: Tournament;
		if (this.isExistTournament) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Tournament ID exists!",
			null
		);
		if (createTournament.tournamentSerieId === null) {
			tournament = await this.createTournamentWithNoTournamentSerie(createTournament, request.user);
		} else {
			tournament = await this.createTournamentWithExistSerie(createTournament);
		}
		return new ApiResponse<Tournament>(
			HttpStatus.OK,
			"Create new tournament successfully!",
			tournament
		);
		// return new ApiResponse<any>(
		// 	200, 
		// 	"Create tournament successfully!",
		// 	await this.tournamentRepository.createTournament({
		// 		...createTournament
		// 	})
		// );
	}

	async isExistTournament(id: string) : Promise<boolean> {
		return await this.tournamentRepository.getTournament(id) === null ? false : true;
	}

	async createTournamentWithNoTournamentSerie(createTournament: CreateTournament,
																							user: User
	) : Promise<Tournament> {
		const tournamentSerie = await this.tournamentSerieRepository.createTournamentSerie({
			...createTournament.createTournamentSerie,
		});
		console.log(tournamentSerie);
		const tournament = await this.createTournament(createTournament, tournamentSerie, user);
		console.log(tournament)
		return tournament;
	}

	async createTournamentWithExistSerie(createTournament: CreateTournament) : Promise<any> {
		const tournamentSerie = await this.tournamentSerieRepository.getTournamentSerie(createTournament.tournamentSerieId);
		console.log(tournamentSerie);
		return tournamentSerie;
	}

	async createTournament(createTournament: CreateTournament, 
												tournamentSerie: TournamentSerie,
												organizer: User) : Promise<Tournament> {
		console.log(tournamentSerie);											
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
			tournamentSerieId: tournamentSerie.id,
			organizerId: organizer.id
		});
		console.log(tournament);
		return tournament
	}
}