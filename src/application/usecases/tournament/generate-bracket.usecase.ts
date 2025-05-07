import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Match, MatchStatus } from "@prisma/client";
import { loadESLint } from "eslint";
import { count } from "node:console";
import { create } from "node:domain";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ICreateMatch } from "src/domain/interfaces/tournament/match/match.interface";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";
import { StageRepositoryPort } from "src/domain/repositories/stage.repository.port";
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";
import { StageOfMatch } from "src/infrastructure/enums/tournament/tournament-match.enum";

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
		const tournamentEvent = await this.tournamentEventRepository.getTournamentEventById(tournamentEventId);
		const tournament = await this.tournamentRepository.getTournament(tournamentEvent.tournamentId);
		if (tournament.status === "OPENING_FOR_REGISTRATION") await this.tournamentRepository.updateTournamentStatusToDrawing(tournament.id);
		const listParticipants = await this.tournamentEventRepository.getParticipantsOfTournamentEvent(tournamentEventId);
		let numberOfBracket = this.getTheNearestNumberOfFullParticipants(listParticipants.listParticipants.length, 1) - 1;
		const numberOfByeParticipants = this.getTheNearestNumberOfFullParticipants(listParticipants.listParticipants.length, 1) - listParticipants.listParticipants.length;
		const numberOfRounds = this.calculateTheNumberOfRound(listParticipants.listParticipants.length);
		const numberOfFullParticipants = this.getTheNearestNumberOfFullParticipants(listParticipants.listParticipants.length, 1);
		const stageOfMatchThirdPlace = await this.stageRepository.createStage(
			{
				stageName: "Third place match",
				tournamentEventId: tournamentEvent.id
			}
		);		
			const thirdPlaceMatch = await this.matchRepository.createMatch(
				{
					isByeMatch: false,
					matchNumber: numberOfBracket + 1,
					stageId: stageOfMatchThirdPlace.id,
					matchStatus: MatchStatus.NOT_STARTED,
					nextMatchId: null,
					tournamentEventId: tournamentEvent.id
				}
			);
		let countableRound = 1;
			let numberOfMatchPerRound = 1;
			let check = 0;
			let nextMatches: Match[] = [];
			do {
				console.log(nextMatches);
				countableRound *= 2;
				// console.log(this.getRoundOfBracket(countableRound));
				check += 1;
				const stageCreate = await this.stageRepository.createStage(
					{
						stageName: this.getRoundOfBracket(countableRound),
						tournamentEventId: tournamentEvent.id
					});
				let matchesCreate: Match[] = [];
				if (check === 1) {
					const matchCreate = await this.matchRepository.createMatch(
						{
							matchStatus: MatchStatus.NOT_STARTED,
							nextMatchId: null,
							stageId: stageCreate.id,
							isByeMatch: false,
							matchNumber: numberOfBracket,
							tournamentEventId: tournamentEvent.id
						}
					);
					matchesCreate.push(matchCreate);
					numberOfBracket -= 1;
				} else if (check === numberOfRounds) {
					//console.log(((numberOfByeParticipants / 2) + 1), " ", Math.ceil(((numberOfFullParticipants - 2) / 2) - Math.ceil(numberOfByeParticipants / 2) + 1));
					const range = this.createRangeNumberArray(((numberOfByeParticipants / 2) + 1), Math.ceil(((numberOfFullParticipants - 2) / 2) - Math.ceil(numberOfByeParticipants / 2) + 1));
					// console.log(nextMatches.length);
					// console.log(this.checkNumberIsInRange(7, range));
					for (let i = 2; i <= nextMatches.length * 2; i+=2) {
						// console.log(numberOfBracket, " ", this.checkNumberIsInRange(i, range));
						if (!this.checkNumberIsInRange(i, range)) {
							// const matchCreate = await prisma.match.create({
							// 	data: {
							// 		matchStatus: MatchStatus.NOT_STARTED,
							// 		nextMatchId: nextMatches[i/2-1].id,
							// 		stageId: stageCreate.id,
							// 		isByeMatch: true,
							// 		matchNumber: numberOfBracket,
							// 		tournamentEventId: tournamentEvent1.id
							// 	}
							// });
							const matchCreate = await this.matchRepository.createMatch(
								{
									matchStatus: MatchStatus.NOT_STARTED,
									nextMatchId: nextMatches[i/2-1].id,
									stageId: stageCreate.id,
									isByeMatch: true,
									matchNumber: numberOfBracket,
									tournamentEventId: tournamentEvent.id
								}
							);
							matchesCreate.push(matchCreate);
							numberOfBracket -= 1;
						} else {
							// const matchCreate = await prisma.match.create({
							// 	data: {
							// 		matchStatus: MatchStatus.NOT_STARTED,
							// 		nextMatchId: nextMatches[i/2-1].id,
							// 		stageId: stageCreate.id,
							// 		isByeMatch: false,
							// 		matchNumber: numberOfBracket,
							// 		tournamentEventId: tournamentEvent1.id
							// 	}
							// });
							const matchCreate = await this.matchRepository.createMatch(
								{
									matchStatus: MatchStatus.NOT_STARTED,
									nextMatchId: nextMatches[i/2-1].id,
									stageId: stageCreate.id,
									isByeMatch: false,
									matchNumber: numberOfBracket,
									tournamentEventId: tournamentEvent.id
								}
							);
							matchesCreate.push(matchCreate);
							numberOfBracket -= 1;
						}
						//console.log(this.checkNumberIsInRange(i - 1, range));
	
						if (!this.checkNumberIsInRange(i - 1, range)) {
							// const matchCreate = await prisma.match.create({
							// 	data: {
							// 		matchStatus: MatchStatus.NOT_STARTED,
							// 		nextMatchId: nextMatches[i/2-1].id,
							// 		stageId: stageCreate.id,
							// 		isByeMatch: true,
							// 		matchNumber: numberOfBracket,
							// 		tournamentEventId: tournamentEvent1.id
							// 	}
							// });
							const matchCreate = await this.matchRepository.createMatch(
								{
									matchStatus: MatchStatus.NOT_STARTED,
									nextMatchId: nextMatches[i/2-1].id,
									stageId: stageCreate.id,
									isByeMatch: true,
									matchNumber: numberOfBracket,
									tournamentEventId: tournamentEvent.id
								}
							);
							matchesCreate.push(matchCreate);
							numberOfBracket -= 1;
						} else {
							// const matchCreate = await prisma.match.create({
							// 	data: {
							// 		matchStatus: MatchStatus.NOT_STARTED,
							// 		nextMatchId: nextMatches[i/2-1].id,
							// 		stageId: stageCreate.id,
							// 		isByeMatch: false,
							// 		matchNumber: numberOfBracket,
							// 		tournamentEventId: tournamentEvent1.id
							// 	}
							// });
							const matchCreate = await this.matchRepository.createMatch(
								{
									matchStatus: MatchStatus.NOT_STARTED,
									nextMatchId: nextMatches[i/2-1].id,
									stageId: stageCreate.id,
									isByeMatch: false,
									matchNumber: numberOfBracket,
									tournamentEventId: tournamentEvent.id
								}
							);
							matchesCreate.push(matchCreate);
							numberOfBracket -= 1;
						}
					}
				} else {
					for (let i = 0; i < nextMatches.length; i++) {
						// const matchCreate = await prisma.match.create({
						// 	data: {
						// 		matchStatus: MatchStatus.NOT_STARTED,
						// 		nextMatchId: nextMatches[i].id,
						// 		stageId: stageCreate.id,
						// 		isByeMatch: false,
						// 		matchNumber: numberOfBracket,
						// 		tournamentEventId: tournamentEvent1.id
						// 	}
						// });
						const matchCreate = await this.matchRepository.createMatch(
							{
								matchStatus: MatchStatus.NOT_STARTED,
								nextMatchId: nextMatches[i].id,
								stageId: stageCreate.id,
								isByeMatch: false,
								matchNumber: numberOfBracket,
								tournamentEventId: tournamentEvent.id
							}
						);
						matchesCreate.push(matchCreate);
						numberOfBracket -= 1;
						// const matchCreate1 = await prisma.match.create({
						// 	data: {
						// 		matchStatus: MatchStatus.NOT_STARTED,
						// 		nextMatchId: nextMatches[i].id,
						// 		stageId: stageCreate.id,
						// 		isByeMatch: false,
						// 		matchNumber: numberOfBracket,
						// 		tournamentEventId: tournamentEvent1.id
						// 	}
						// });
						const matchCreate1 = await this.matchRepository.createMatch(
							{
								matchStatus: MatchStatus.NOT_STARTED,
								nextMatchId: nextMatches[i].id,
								stageId: stageCreate.id,
								isByeMatch: false,
								matchNumber: numberOfBracket,
								tournamentEventId: tournamentEvent.id
							}
						);
						matchesCreate.push(matchCreate1);
						numberOfBracket -= 1;
					}
				}
				nextMatches = matchesCreate;
				// if (check === numberOfRounds - 1) {
				// 	// console.log(nextMatches);
				// 	// console.log(nextMatches.length);
				// }
			} while (check < numberOfRounds);		
		// console.log(numberOfRounds);
			// const thirdPlaceMatch = await prisma.match.create({
			// 	data: {
			// 		isByeMatch: false,
			// 		matchNumber: 0,
			// 		stageId: stageOfMatch.id,
			// 		matchStatus: MatchStatus.NOT_STARTED,
			// 		nextMatchId: null,
			// 		tournamentEventId: tournamentEvent1.id
			// 	}
			// });
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
				return StageOfMatch.Final;
				break;
			case 4: 
				return StageOfMatch.Semi_Final;
				break;
			case 8:
				return StageOfMatch.Quarter_Final;
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