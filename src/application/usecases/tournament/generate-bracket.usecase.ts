import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { loadESLint } from "eslint";
import { ApiResponse } from "src/domain/dtos/api-response";
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";

@Injectable()
export class GenerateBracketUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
		@Inject("TournamentEventRepository")
		private readonly tournamentEventRepository: TournamentEventRepositoryPort
	) {
	}

	async execute(tournamentEventId: string): Promise<ApiResponse<number>> {
		const listParticipants = await this.tournamentEventRepository.getParticipantsOfTournamentEvent(tournamentEventId);
		const logarit = this.getTheNearestNumberOfFullParticipants(listParticipants.numberOfParticipants, 1);
		const numberOfByeParticipants = logarit - listParticipants.numberOfParticipants;
		console.log(listParticipants.numberOfParticipants);
		return new ApiResponse<number>(
			HttpStatus.OK,
			"Generate bracket successful!",
			numberOfByeParticipants
		);
	}

	getTheNearestNumberOfFullParticipants(numeberOfParticipants: number, lastNumber: number): number {
		return lastNumber < numeberOfParticipants ? this.getTheNearestNumberOfFullParticipants(numeberOfParticipants, lastNumber *2) : lastNumber;
	}
}