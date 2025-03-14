import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Tournament, TournamentEvent, TournamentSerie, User } from "@prisma/client";
import { create } from "domain";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IRequestUser } from "src/domain/interfaces/interfaces";
import { ICreateTournament, ICreateTournamentEvent } from "src/domain/interfaces/tournament/tournament.interface";
import { CreateTournament, CreateTournamentEvent } from "src/domain/interfaces/tournament/tournament.validation";
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";
import { TournamentSerieRepositoryPort } from "src/domain/repositories/tournament-serie.repository.port";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";

@Injectable()
export class CreateNewTournamentUseCase {
	constructor(
		@Inject("TournamentRepository") private readonly tournamentRepository: TournamentRepositoryPort,
		@Inject("TournamentSerieRepository") private readonly tournamentSerieRepository: TournamentSerieRepositoryPort,
		@Inject("TournamentEventRepository") private readonly tournamentEventRepository: TournamentEventRepositoryPort
	) {}

	async execute(request: IRequestUser, createTournament: CreateTournament) : Promise<ApiResponse<any>> {
		console.log(request.user);
		var tournament: Tournament;
		if (await this.isExistTournament(createTournament.id) === true) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Tournament ID exists!",
			null
		);
		if (createTournament.tournamentSerieId === null) {
			tournament = await this.createTournamentWithNoTournamentSerie(createTournament, request.user);
		} else {
			tournament = await this.createTournamentWithExistSerie(createTournament, request.user);
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
		const tournament = await this.tournamentRepository.getTournament(id);
		console.log(tournament);
		return false;
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
		const tournamentEvents = await this.createTournamentEvents(createTournament.createTournamentEvent, tournament.id)
		return tournament;
	}

	async createTournamentEvents(createTournamentEvents: CreateTournamentEvent[], tournamentId: string) : Promise<TournamentEvent[]>{
		const tournamentEvents = await this.tournamentEventRepository.createMultipleTournamentEvent({
			...createTournamentEvents
			
		}, tournamentId);
		return null;
	}

	async createTournamentWithExistSerie(createTournament: CreateTournament, user: User) : Promise<any> {
		const tournamentSerie = await this.tournamentSerieRepository.getTournamentSerie(createTournament.tournamentSerieId);
		console.log(tournamentSerie);
		const tournament = await this.createTournament(createTournament, tournamentSerie, user);
		console.log(tournament)
		const tournamentEvents = await this.createTournamentEvents(createTournament.createTournamentEvent, tournament.id)
		return tournament;
	}

	async createTournament(createTournament: CreateTournament, 
												tournamentSerie: TournamentSerie,
												organizer: User) : Promise<Tournament> {
		console.log(tournamentSerie.id);											
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