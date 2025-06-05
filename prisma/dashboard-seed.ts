import { match } from 'assert';
import { Match, MatchStatus, Prisma, PrismaClient, PrizeType, TeamStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { create } from "domain";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	await createBrackets();
}

async function createBrackets() {
	const tournaments = await prisma.tournament.findMany({
		where: {
			id: { 
				in: [
					"hue-heritage-cup-2024",
					"cantho-delta-open-2024",
					"ha-noi-grand-prix-2024",
					"hcm-spring-smash-2024",
					"vung-tau-beach-smash-2024",
					"giai-1001",
					"giai-1101",
					"giai-1201",
					"giai-0101",
					"giai-0201",
					"giai-0301",
					"giai-0401",
					"giai-0501"
				]
			}
		},
		select: {
			id: true,
			registrationOpeningDate: true,
			registrationClosingDate: true,
			startDate: true,
			endDate: true,
			tournamentEvents: {
				select: {
					id: true
				}
			}
		}
	});
	for (let i = 0; i < tournaments.length; i++) {
		for (let j = 0; j < tournaments[i].tournamentEvents.length; j++) {
			await createBracket(tournaments[i].tournamentEvents[j].id);
		}
	}
}

async function createBracket(tournamentEventId: string) {
	const tournamentParticipants = await prisma.tournamentParticipants.findMany({
		where: {
			tournamentEventId: tournamentEventId
		}
	});
	const tournamentEvent = await prisma.tournamentEvent.findUnique({
		where: {
			id: tournamentEventId
		},
		select: {
			id: true,
			tournament: true
		}
	});
	let numberOfBracket = getTheNearestNumberOfFullParticipants(tournamentParticipants.length, 1) - 1;
	const numberOfByeParticipants = getTheNearestNumberOfFullParticipants(tournamentParticipants.length, 1) - tournamentParticipants.length;
	const numberOfRounds = calculateTheNumberOfRound(tournamentParticipants.length);
	const numberOfFullParticipants = getTheNearestNumberOfFullParticipants(tournamentParticipants.length, 1);
	let countableRound = 1;
	//Set up thirdPlacePrize
	const thirdPlacePrizes = await prisma.eventPrize.findMany({
		where: {
			tournamentEventId: tournamentEventId,
			prizeType: PrizeType.ThirdPlacePrize,

		}
	});
	if (thirdPlacePrizes.length == 2) {
		const thirdPlaceStage = await prisma.stage.create({
			data: {
				stageName: "Third place match",
				tournamentEventId: tournamentEventId
			}
		})
		const thirdPlaceMatchCreated = await prisma.match.create({
			data: {
				isByeMatch: false,
				matchNumber: numberOfBracket + 1,
				stageId: thirdPlaceStage.id,
				matchStatus: MatchStatus.NOT_STARTED,
				nextMatchId: null,
				tournamentEventId: tournamentEventId,
				startedWhen: await getRandomDate(tournamentEvent.tournament.startDate, tournamentEvent.tournament.endDate)
			}
		});
	}
	//seed matches
	let numberOfMatchPerRound = 1;
	let check = 0;
	let nextMatches: Match[] = [];
	do {
		console.log(nextMatches);
		countableRound *= 2;
		check += 1;
		const stageCreate = await createStage(
			getRoundOfBracket(countableRound),
			tournamentEvent.id);
		let matchesCreate: Match[] = [];
		if (check === 1) {
			const matchCreate = await prisma.match.create({
				data: {
					matchStatus: MatchStatus.NOT_STARTED,
					nextMatchId: null,
					stageId: stageCreate.id,
					isByeMatch: false,
					matchNumber: numberOfBracket,
					tournamentEventId: tournamentEvent.id,
					startedWhen: await getRandomDate(tournamentEvent.tournament.startDate, tournamentEvent.tournament.endDate)					
				}
			});
			matchesCreate.push(matchCreate);
			numberOfBracket -= 1;
		} else if (check === numberOfRounds) {
			const range = createRangeNumberArray(((numberOfByeParticipants / 2) + 1), Math.ceil(((numberOfFullParticipants - 2) / 2) - Math.ceil(numberOfByeParticipants / 2) + 1));
			for (let i = 2; i <= nextMatches.length * 2; i+=2) {
				// console.log(numberOfBracket, " ", this.checkNumberIsInRange(i, range));
				if (!checkNumberIsInRange(i, range)) {
					const matchCreate = await prisma.match.create({
						data: {
							matchStatus: MatchStatus.NOT_STARTED,
							nextMatchId: nextMatches[i/2-1].id,
							stageId: stageCreate.id,
							isByeMatch: true,
							matchNumber: numberOfBracket,
							tournamentEventId: tournamentEvent.id,
							startedWhen: await getRandomDate(tournamentEvent.tournament.startDate, tournamentEvent.tournament.endDate)
						}
					});
					matchesCreate.push(matchCreate);
					numberOfBracket -= 1;
				} else {
					const matchCreate = await prisma.match.create({
						data: {
							matchStatus: MatchStatus.NOT_STARTED,
							nextMatchId: nextMatches[i/2-1].id,
							stageId: stageCreate.id,
							isByeMatch: false,
							matchNumber: numberOfBracket,
							tournamentEventId: tournamentEvent.id,
							startedWhen: await getRandomDate(tournamentEvent.tournament.startDate, tournamentEvent.tournament.endDate)
						}
					});
					matchesCreate.push(matchCreate);
					numberOfBracket -= 1;
				}
				if (!checkNumberIsInRange(i - 1, range)) {
					const matchCreate = await prisma.match.create({
						data: {
							matchStatus: MatchStatus.NOT_STARTED,
							nextMatchId: nextMatches[i/2-1].id,
							stageId: stageCreate.id,
							isByeMatch: true,
							matchNumber: numberOfBracket,
							tournamentEventId: tournamentEvent.id,
							startedWhen: await getRandomDate(tournamentEvent.tournament.startDate, tournamentEvent.tournament.endDate)
						}
					});
					matchesCreate.push(matchCreate);
					numberOfBracket -= 1;
				} else {
					const matchCreate = await prisma.match.create({
						data: {
							matchStatus: MatchStatus.NOT_STARTED,
							nextMatchId: nextMatches[i/2-1].id,
							stageId: stageCreate.id,
							isByeMatch: false,
							matchNumber: numberOfBracket,
							tournamentEventId: tournamentEvent.id,
							startedWhen: await getRandomDate(tournamentEvent.tournament.startDate, tournamentEvent.tournament.endDate)
						}
					});
					matchesCreate.push(matchCreate);
					numberOfBracket -= 1;
				}
			}
		} else {
			for (let i = 0; i < nextMatches.length; i++) {
				const matchCreate = await prisma.match.create({
					data: {
						matchStatus: MatchStatus.NOT_STARTED,
						nextMatchId: nextMatches[i].id,
						stageId: stageCreate.id,
						isByeMatch: false,
						matchNumber: numberOfBracket,
						tournamentEventId: tournamentEvent.id,
						startedWhen: await getRandomDate(tournamentEvent.tournament.startDate, tournamentEvent.tournament.endDate)
					}
				});
				matchesCreate.push(matchCreate);
				numberOfBracket -= 1;
				const matchCreate1 = await prisma.match.create({
					data: {
						matchStatus: MatchStatus.NOT_STARTED,
						nextMatchId: nextMatches[i].id,
						stageId: stageCreate.id,
						isByeMatch: false,
						matchNumber: numberOfBracket,
						tournamentEventId: tournamentEvent.id,
						startedWhen: await getRandomDate(tournamentEvent.tournament.startDate, tournamentEvent.tournament.endDate)
					}
				});
				matchesCreate.push(matchCreate1);
				numberOfBracket -= 1;
			}
		}
		nextMatches = matchesCreate;
	} while (check < numberOfRounds);
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

async function getRandomDate(startDate: Date, endDate: Date): Promise<Date> {
	const startTime = startDate.getTime();
	const endTime = endDate.getTime();
	const randomTime = startTime + Math.random() * (endTime - startTime);
	return new Date(randomTime);
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


