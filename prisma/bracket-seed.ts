import { Match, MatchStatus, Prisma, PrismaClient, TournamentParticipants } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { ICreateMatch } from "src/domain/interfaces/tournament/match/match.interface";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	const tournamentEvent1 = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentEvent: "MENS_SINGLE",
			tournamentId: "hcmc-open-2025"
		}
	});
	const tournamentParticipants1 = await prisma.tournamentParticipants.findMany({
		where: {
			tournamentEventId: tournamentEvent1.id
		}
	});
	console.log(tournamentParticipants1);
	const tournamentEvent2 = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentEvent: "MENS_DOUBLE",
			tournamentId: "hcmc-open-2025"
		}
	});

	const tournamentParticipants2 = await prisma.tournamentParticipants.findMany({
		where: {
			tournamentEventId: tournamentEvent2.id
		}
	});

	await createBracketFunction1(tournamentEvent1, tournamentParticipants1);
	await createBracketFunction1(tournamentEvent2, tournamentParticipants2);

	await addParticipantsToBracket(tournamentEvent1.id);
	await addParticipantsToBracket(tournamentEvent2.id);
	//console.log(tournamentParticipants1.length);
	
}

async function addParticipantsToBracket(tournamentEventId: string) {
	const tournamentParticipants = await prisma.tournamentParticipants.findMany({
		where: {
			tournamentEventId: tournamentEventId
		}
	});
	const numberOfMatch = getTheNearestNumberOfFullParticipants(tournamentParticipants.length, 1) / 2;
	const matches = await prisma.match.findMany({
		where: {
			tournamentEventId: tournamentEventId,
			matchNumber: {
				lte: numberOfMatch
			}
		},
		orderBy: {
			matchNumber: "asc"
		}
	});
	var currentMatch = 0;
	var check = 0;
	while (check < tournamentParticipants.length) {
		if (matches[currentMatch].isByeMatch) {
			console.log(check);
			matches[currentMatch].leftCompetitorId = tournamentParticipants[check].id;
			await prisma.match.update({
				where: {
					id: matches[currentMatch].id
				},
				data: {
					...matches[currentMatch]
				}
			});
			check++;
			currentMatch++;
			// console.log("current match: ", matches[currentMatch].id);
		} else {
			matches[currentMatch].leftCompetitorId = tournamentParticipants[check].id;
			check++;
			matches[currentMatch].rightCompetitorId = tournamentParticipants[check].id;
			await prisma.match.update({
				where: {
					id: matches[currentMatch].id
				},
				data: {
					...matches[currentMatch]
				}
			});
			check++;
			currentMatch++;
			// console.log("current match: ", currentMatch);
		}
	}
	console.log(matches);

}

async function createBracketFunction1(tournamentEvent1: any, tournamentParticipants1: any) {
	let numberOfBracket = getTheNearestNumberOfFullParticipants(tournamentParticipants1.length, 1) - 1;
	const numberOfByeParticipants = getTheNearestNumberOfFullParticipants(tournamentParticipants1.length, 1) - tournamentParticipants1.length;
	const numberOfRounds = calculateTheNumberOfRound(tournamentParticipants1.length);
	const numberOfFullParticipants = getTheNearestNumberOfFullParticipants(tournamentParticipants1.length, 1);

	let countableRound = 1;
			let numberOfMatchPerRound = 1;
			let check = 0;
			let nextMatches: Match[] = [];
			do {
				countableRound *= 2;
				// console.log(this.getRoundOfBracket(countableRound));
				check += 1;
				const stageCreate = await createStage(
					getRoundOfBracket(countableRound),
					tournamentEvent1.id);
				let matchesCreate: ICreateMatch[] = [];
				if (check === 1) {
					matchesCreate.push({
						matchStatus: MatchStatus.NOT_STARTED,
						nextMatchId: null,
						stageId: stageCreate.id,
						isByeMatch: false,
						matchNumber: numberOfFullParticipants - 1,
						tournamentEventId: tournamentEvent1.id
					});
					numberOfBracket -= 1;
				} else if (check === numberOfRounds) {
					//console.log(((numberOfByeParticipants / 2) + 1), " ", Math.ceil(((numberOfFullParticipants - 2) / 2) - Math.ceil(numberOfByeParticipants / 2) + 1));
					const range = createRangeNumberArray(((numberOfByeParticipants / 2) + 1), Math.ceil(((numberOfFullParticipants - 2) / 2) - Math.ceil(numberOfByeParticipants / 2) + 1));
					// console.log(nextMatches.length);
					// console.log(this.checkNumberIsInRange(7, range));
					for (let i = nextMatches.length * 2; i >= 2; i-=2) {
						// console.log(numberOfBracket, " ", this.checkNumberIsInRange(i, range));
						if (!checkNumberIsInRange(i, range)) {
							matchesCreate.push({
								isByeMatch: true,
								matchStatus: MatchStatus.NOT_STARTED,
								nextMatchId: nextMatches[i/2-1].id,
								stageId: stageCreate.id,
								matchNumber: i,
								tournamentEventId: tournamentEvent1.id
							});
						} else {
							matchesCreate.push({
								isByeMatch: false,
								matchStatus: MatchStatus.NOT_STARTED,
								nextMatchId: nextMatches[i/2-1].id,
								stageId: stageCreate.id,
								matchNumber: i,
								tournamentEventId: tournamentEvent1.id
							});
						}
						numberOfBracket -= 1;
						//console.log(this.checkNumberIsInRange(i - 1, range));
	
						if (!checkNumberIsInRange(i - 1, range)) {
							matchesCreate.push({
								isByeMatch: true,
								matchStatus: MatchStatus.NOT_STARTED,
								nextMatchId: nextMatches[i/2-1].id,
								stageId: stageCreate.id,
								matchNumber: i - 1,
								tournamentEventId: tournamentEvent1.id
							});
						} else {
							matchesCreate.push({
								isByeMatch: false,
								matchStatus: MatchStatus.NOT_STARTED,
								nextMatchId: nextMatches[i/2-1].id,
								stageId: stageCreate.id,
								matchNumber: i - 1,
								tournamentEventId: tournamentEvent1.id
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
							tournamentEventId: tournamentEvent1.id				
						});
						numberOfBracket -= 1;
						matchesCreate.push({
							isByeMatch: false,
							matchNumber: numberOfBracket,
							matchStatus: MatchStatus.NOT_STARTED,
							nextMatchId: nextMatches[i].id,
							stageId: stageCreate.id,
							tournamentEventId: tournamentEvent1.id				
						});
						numberOfBracket -= 1;
					}
				}
				// console.log(matchesCreate);
				const createMatches = await createMultipleMatch(matchesCreate);
				nextMatches = createMatches;
				// if (check === numberOfRounds - 1) {
				// 	// console.log(nextMatches);
				// 	// console.log(nextMatches.length);
				// }
			} while (check < numberOfRounds);
}

async function createMultipleMatch(matches: ICreateMatch[]) {
	return await prisma.match.createManyAndReturn({
		data: matches
	});
}

function getTheNearestNumberOfFullParticipants(numeberOfParticipants: number, lastNumber: number): number {
	return lastNumber < numeberOfParticipants ? getTheNearestNumberOfFullParticipants(numeberOfParticipants, lastNumber *2) : lastNumber;
}

function calculateTheNumberOfRound(numberOfParticipants: number): number {
	return Math.ceil(Math.log2(numberOfParticipants));
}

function getRoundOfBracket(numberOfPlayerPerRound: number): string {
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

function createRangeNumberArray(start: number, end: number) : number[] {
	return Array.from({ length: (end - Math.floor(start) + 1) }, (_, i) => Math.ceil(Math.floor(start) + i));
}

function checkNumberIsInRange(numberToCheck: number, integerArray: number[]) : boolean {
	if (integerArray.length === 0) return false; // Handle empty array case
	let min = Math.min(...integerArray);
	let max = Math.max(...integerArray);
	return numberToCheck >= min && numberToCheck <= max;
}

async function createStage(stageName: string, tournamentEventId: string) {
	return await prisma.stage.create({
		data: { 
			stageName: stageName,
			tournamentEventId: tournamentEventId
		}
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
