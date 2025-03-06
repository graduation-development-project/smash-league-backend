import { Inject, Injectable } from "@nestjs/common";
import { create } from "domain";
import { ApiResponse } from "src/domain/dtos/api-response";
import { CreateTournament } from "src/domain/interfaces/tournament/tournament.interface";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";

@Injectable()
export class CreateNewTournamentUseCase {
	constructor(
		@Inject("TournamentRepository") private readonly tournamentRepository: TournamentRepositoryPort
	) {}

	async execute(createTournament: CreateTournament) : Promise<ApiResponse<any>> {
		return new ApiResponse<any>(
			200, 
			"Create tournament successfully!",
			await this.tournamentRepository.createTournament({
				id: createTournament.id,
				name: createTournament.name,
				shortName: createTournament.shortName,
				registrationOpeningDate: createTournament.registrationOpeningDate,
				registrationClosingDate: createTournament.registrationClosingDate,
				drawDate: createTournament.drawDate,
				startDate: createTournament.startDate,
				endDate: createTournament.endDate,
				prizePool: createTournament.prizePool,
				registrationFeePerPerson: createTournament.registrationFeePerPerson,
				registrationFeePerPair: createTournament.registrationFeePerPair,
				protestFeePerTime: createTournament.protestFeePerTime,
				hasMerchandise: createTournament.hasMerchandise,
				numberOfMerchandise: createTournament.numberOfMerchandise,
				merchandise: createTournament.merchandise,
				checkInBeforeStart: createTournament.checkinTimeBeforeStart,
				maxEventPerPerson: createTournament.maxEventPerPerson,
				umpirePerMatch: createTournament.umpirePerMatch,
				linemanPerMatch: createTournament.linemanPerMatch,
				merchandiseImageContent: createTournament.merchandiseImageContent
			})
		);
	}
}