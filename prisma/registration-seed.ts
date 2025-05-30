import { Gender, Prisma, PrismaClient, TeamStatus, Tournament, TournamentRegistrationRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	// const tournamentRegistration: Prisma.TournamentRegistrationCreateManyInput[] = [
	// 	{

	// 	}
	// ];
	const hcmcOpenTournament = await prisma.tournament.findUnique({
		where: {
			id: "hcmc-open-2025"
		},
		select: {
			name: true,
			id: true,
			tournamentEvents: {
				select: {
					id: true,
					requirements: true,
					tournamentEvent: true
				}
			}
		}
	});
	const user = await prisma.user.findMany({
		where: {
			gender: Gender.MALE
		}
	});
	const registration: Prisma.TournamentRegistrationCreateManyInput[] = [
		{
			userId: user[0].id,
			tournamentId: hcmcOpenTournament.id,
			tournamentEventId: hcmcOpenTournament.tournamentEvents[0].id,
			registrationRole: TournamentRegistrationRole.ATHLETE
		},
		{
			userId: user[1].id,
			tournamentId: hcmcOpenTournament.id,
			tournamentEventId: hcmcOpenTournament.tournamentEvents[0].id,
			registrationRole: TournamentRegistrationRole.ATHLETE
		}
	];
	console.log(hcmcOpenTournament);
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
