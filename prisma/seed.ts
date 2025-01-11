import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	// create two dummy recipes
	const recipe1 = await prisma.teams.upsert({
		where: { team_id: 1 },
		update: {},
		create: {
			team_name: 'Spaghetti Bolognese',
		},
	});

	const recipe2 = await prisma.teams.upsert({
		where: { team_id: 1 },
		update: {},
		create: {
			team_name: 'Chicken Curry',
		},
	});

	console.log({ recipe1, recipe2 });
}

// execute the main function
main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		// close Prisma Client at the end
		await prisma.$disconnect();
	});
