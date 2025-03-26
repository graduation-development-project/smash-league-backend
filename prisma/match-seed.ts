import { Prisma, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	const tournamentEvent = await prisma.tournamentEvent.findFirst({
		where: {
			typeOfFormat: "SINGLE_ELIMINATION"
		}
	});
	console.log(tournamentEvent);

	
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
