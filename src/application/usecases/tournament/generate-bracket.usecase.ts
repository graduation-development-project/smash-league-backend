import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { MatchStatus } from "@prisma/client";
import { loadESLint } from "eslint";
import { count } from "node:console";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ICreateMatch } from "src/domain/interfaces/tournament/match/match.interface";
import { StageRepositoryPort } from "src/domain/repositories/stage.repository.port";
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";

@Injectable()
export class GenerateBracketUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
		@Inject("TournamentEventRepository")
		private readonly tournamentEventRepository: TournamentEventRepositoryPort,
		@Inject("StageRepository")
		private readonly stageRepository: StageRepositoryPort
		
	) {
	}

	async execute(tournamentEventId: string): Promise<ApiResponse<number>> {
		const listParticipants = await this.tournamentEventRepository.getParticipantsOfTournamentEvent(tournamentEventId);
		const logarit = this.getTheNearestNumberOfFullParticipants(listParticipants.numberOfParticipants, 1);
		const numberOfByeParticipants = logarit - listParticipants.numberOfParticipants;
		const numberOfRounds = this.calculateTheNumberOfRound(listParticipants.numberOfParticipants);
		let countableRound = 1;
		let check = 0;
		let numberOfMatch = this.getTheNearestNumberOfFullParticipants(listParticipants.numberOfParticipants, 1) - 1;
		console.log(numberOfMatch);
		do {
			countableRound *= 2;
			console.log(this.getRoundOfBracket(countableRound));
			console.log(countableRound);
			check += 1;
			// console.log(check);
			// const stageCreate = await this.stageRepository.createStage({
			// 	stageName: this.getRoundOfBracket(countableRound),
			// 	tournamentEventId: tournamentEventId
			// });
			// console.log(stageCreate);
			let matches: ICreateMatch[] = [];
			if (check === 1) {
				numberOfMatch -= 1;
				// matches.push({
				// 	matchStatus: MatchStatus.NOT_STARTED,
				// 	nextMatchId: null,
				// 	stageId: stageCreate.id,
				// 	isByeMatch: false
				// });
			} else if (check === numberOfRounds) {
				
			}
		} while (check < numberOfRounds);
		// console.log(numberOfRounds);
		return new ApiResponse<number>(
			HttpStatus.OK,
			"Generate bracket successful!",
			numberOfByeParticipants
		);
	}

	getTheNearestNumberOfFullParticipants(numeberOfParticipants: number, lastNumber: number): number {
		return lastNumber < numeberOfParticipants ? this.getTheNearestNumberOfFullParticipants(numeberOfParticipants, lastNumber *2) : lastNumber;
	}

	calculateTheNumberOfRound(numberOfParticipants: number): number {
		return Math.floor(Math.log2(numberOfParticipants));
	}

	getRoundOfBracket(numberOfPlayerPerRound: number): string {
		switch(numberOfPlayerPerRound) {
			case 2: 
				return "Final";
				break;
			case 4: 
				return "Semi-final";
				break;
			case 8:
				return "Quarter-final";
				break;
			default: 
				return `1/${numberOfPlayerPerRound / 2}`
				break;			
		}
	}
}