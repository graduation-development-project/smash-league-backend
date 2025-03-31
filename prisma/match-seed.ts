import { Prisma, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	const tournamentEvent = await prisma.tournamentEvent.findFirst({
		where: {
			typeOfFormat: "SINGLE_ELIMINATION",
		}
	});
	console.log(tournamentEvent);
	const participants = await prisma.user.findMany({
		where: {
			gender: "MALE"
		}
	});
	console.log(participants.length);
	let tournamentParticipants = [];
	for (const participant of participants) {
		const account = await prisma.tournamentParticipants.create({
			data: {
				userId: participant.id,
				tournamentEventId: tournamentEvent.id,
				tournamentId: tournamentEvent.tournamentId,
			}
		});
		tournamentParticipants.push(account);
	}
	console.log(tournamentParticipants);

	const tournamentEvent2 = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentEvent: "MENS_DOUBLE"
		}
	});
	console.log(tournamentEvent2);
	var participants2 = [];
	for (let i = 0; i < participants.length; i+=2) {
		const account = await prisma.tournamentParticipants.create({
			data: {
				userId: participants[i].id,
				partnerId: participants[i+1].id,
				tournamentEventId: tournamentEvent2.id,
				tournamentId: tournamentEvent2.tournamentId,
			}
		});
		participants2.push(account);
	}

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
