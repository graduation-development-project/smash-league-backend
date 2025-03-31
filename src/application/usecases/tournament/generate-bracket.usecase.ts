import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Match, MatchStatus } from "@prisma/client";
import { loadESLint } from "eslint";
import { count } from "node:console";
import { create } from "node:domain";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ICreateMatch } from "src/domain/interfaces/tournament/match/match.interface";
import { MatchRepositoryPort } from "src/domain/interfaces/repositories/match.repository.port";
import { StageRepositoryPort } from "src/domain/interfaces/repositories/stage.repository.port";
import { TournamentEventRepositoryPort } from "src/domain/interfaces/repositories/tournament-event.repository.port";
import { TournamentRepositoryPort } from "src/domain/interfaces/repositories/tournament.repository.port";

@Injectable()
export class GenerateBracketUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
		@Inject("TournamentEventRepository")
		private readonly tournamentEventRepository: TournamentEventRepositoryPort,
		@Inject("StageRepository")
		private readonly stageRepository: StageRepositoryPort,
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort
	) {
	}

	async execute(tournamentEventId: string): Promise<ApiResponse<number>> {
		const listParticipants = await this.tournamentEventRepository.getParticipantsOfTournamentEvent(tournamentEventId);
		let numberOfBracket = this.getTheNearestNumberOfFullParticipants(listParticipants.numberOfParticipants, 1) - 1;
		const numberOfByeParticipants = this.getTheNearestNumberOfFullParticipants(listParticipants.numberOfParticipants, 1) - listParticipants.numberOfParticipants;
		const numberOfRounds = this.calculateTheNumberOfRound(listParticipants.numberOfParticipants);
		const numberOfFullParticipants = this.getTheNearestNumberOfFullParticipants(listParticipants.numberOfParticipants, 1);
		// console.log(numberOfFullParticipants);
		console.log(numberOfBracket);
		let countableRound = 1;
		let numberOfMatchPerRound = 1;
		let check = 0;
		let nextMatches: Match[] = [];
		do {
			countableRound *= 2;
			// console.log(this.getRoundOfBracket(countableRound));
			check += 1;
			const stageCreate = await this.stageRepository.createStage({
				stageName: this.getRoundOfBracket(countableRound),
				tournamentEventId: tournamentEventId
			});
			let matchesCreate: ICreateMatch[] = [];
			if (check === 1) {
				matchesCreate.push({
					matchStatus: MatchStatus.NOT_STARTED,
					nextMatchId: null,
					stageId: stageCreate.id,
					isByeMatch: false,
					matchNumber: numberOfFullParticipants - 1,
					tournamentEventId: tournamentEventId
				});
				numberOfBracket -= 1;
			} else if (check === numberOfRounds) {
				//console.log(((numberOfByeParticipants / 2) + 1), " ", Math.ceil(((numberOfFullParticipants - 2) / 2) - Math.ceil(numberOfByeParticipants / 2) + 1));
				const range = this.createRangeNumberArray(((numberOfByeParticipants / 2) + 1), Math.ceil(((numberOfFullParticipants - 2) / 2) - Math.ceil(numberOfByeParticipants / 2) + 1));
				// console.log(nextMatches.length);
				// console.log(this.checkNumberIsInRange(7, range));
				for (let i = nextMatches.length * 2; i >= 2; i-=2) {
					// console.log(numberOfBracket, " ", this.checkNumberIsInRange(i, range));
					if (!this.checkNumberIsInRange(i, range)) {
						matchesCreate.push({
							isByeMatch: true,
							matchStatus: MatchStatus.NOT_STARTED,
							nextMatchId: nextMatches[i/2-1].id,
							stageId: stageCreate.id,
							matchNumber: i,
							tournamentEventId: tournamentEventId
						});
					} else {
						matchesCreate.push({
							isByeMatch: false,
							matchStatus: MatchStatus.NOT_STARTED,
							nextMatchId: nextMatches[i/2-1].id,
							stageId: stageCreate.id,
							matchNumber: i,
							tournamentEventId: tournamentEventId
						});
					}
					numberOfBracket -= 1;
					//console.log(this.checkNumberIsInRange(i - 1, range));

					if (!this.checkNumberIsInRange(i - 1, range)) {
						matchesCreate.push({
							isByeMatch: true,
							matchStatus: MatchStatus.NOT_STARTED,
							nextMatchId: nextMatches[i/2-1].id,
							stageId: stageCreate.id,
							matchNumber: i - 1,
							tournamentEventId: tournamentEventId
						});
					} else {
						matchesCreate.push({
							isByeMatch: false,
							matchStatus: MatchStatus.NOT_STARTED,
							nextMatchId: nextMatches[i/2-1].id,
							stageId: stageCreate.id,
							matchNumber: i - 1,
							tournamentEventId: tournamentEventId
						});
					}
					numberOfBracket -= 1;
				}
			} else {
				for (let i = 0; i < nextMatches.length; i++) {
					matchesCreate.push({
						isByeMatch: false,
						matchNumber: numberOfBracket,
						matchStatus: MatchStatus.NOT_STARTED,
						nextMatchId: nextMatches[i].id,
						stageId: stageCreate.id,
						tournamentEventId: tournamentEventId				
					});
					numberOfBracket -= 1;
					matchesCreate.push({
						isByeMatch: false,
						matchNumber: numberOfBracket,
						matchStatus: MatchStatus.NOT_STARTED,
						nextMatchId: nextMatches[i].id,
						stageId: stageCreate.id,
						tournamentEventId: tournamentEventId				
					});
					numberOfBracket -= 1;
				}
			}
			// console.log(matchesCreate);
			const createMatches = await this.matchRepository.createMultipleMatch(matchesCreate);
			nextMatches = createMatches;
			if (check === numberOfRounds - 1) {
				// console.log(nextMatches);
				// console.log(nextMatches.length);
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
		return Math.ceil(Math.log2(numberOfParticipants));
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
				return `Round 1/${numberOfPlayerPerRound}`
				break;			
		}
	}

	createRangeNumberArray(start: number, end: number) : number[] {
		return Array.from({ length: (end - Math.floor(start) + 1) }, (_, i) => Math.ceil(Math.floor(start) + i));
	}

	checkNumberIsInRange(numberToCheck: number, integerArray: number[]) : boolean {
		if (integerArray.length === 0) return false; // Handle empty array case
    let min = Math.min(...integerArray);
    let max = Math.max(...integerArray);
    return numberToCheck >= min && numberToCheck <= max;
	}

}