import { Gender, Prisma, PrismaClient, TeamStatus, Tournament, TournamentRegistrationRole, TournamentRegistrationStatus, TransactionStatus, TransactionType } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	await createAthleteTransaction();
}

async function createAthleteTransaction() {
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
			tournamentEvents: {
				select: {
					id: true,
					tournamentEvent: true
				}
			},
			registrationFeePerPerson: true,
			registrationOpeningDate: true,
			registrationClosingDate: true
		}
	});

	const tournamentRegistrations = await prisma.tournamentRegistration.findMany({
		where: {
			tournamentId: {
				in: tournaments.map((item) => item.id)
			},
			registrationRole: TournamentRegistrationRole.ATHLETE,
			status: TournamentRegistrationStatus.PENDING
		},
		select: {
			id: true,
			createdAt: true,
			userId: true,
			tournament: {
				select: {
					id: true,
					registrationClosingDate: true,
					registrationFeePerPerson: true
				}
			}	
		}
	});
	console.log(tournamentRegistrations.length);
	var userTransactions: Prisma.TransactionCreateManyInput[] = [];
	for (let i = 0; i < tournamentRegistrations.length; i++) {
		userTransactions.push({
			userId: tournamentRegistrations[i].userId,
			transactionType: TransactionType.PAY_REGISTRATION_FEE,
			createdAt: await getRandomDate(tournamentRegistrations[i].createdAt, tournamentRegistrations[i].tournament.registrationClosingDate),
			status: TransactionStatus.SUCCESSFUL,
			value: tournamentRegistrations[i].tournament.registrationFeePerPerson,
			transactionDetail: ""
		});
	}
	const userTransactionCreated = await prisma.transaction.createManyAndReturn({
		data: userTransactions
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
