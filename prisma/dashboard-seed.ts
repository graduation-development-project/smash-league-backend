import { Prisma, PrismaClient, TeamStatus } from "@prisma/client";
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
	console.log(tournamentParticipants);
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


