import { OrderStatus, Prisma, PrismaClient, TeamStatus, TransactionStatus, TransactionType } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	await createOrganizerTransaction();
}

async function createOrganizerTransaction() {
	const getStartOfWeek = await getStartOfWeekAsync(new Date());
	console.log(new Date());
}

async function getStartOfWeekAsync(date: Date): Promise<Date> {
  const given = new Date(date);
  const day = given.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  given.setDate(given.getDate() + diff + 1);
  given.setHours(0, 0, 0, 0);
  return given;
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
