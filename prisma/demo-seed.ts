import { OrderStatus, Prisma, PrismaClient, TeamStatus, TransactionStatus, TransactionType } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	await createOrganizerTransaction();
}

async function createOrganizerTransaction() {
	const participants = await prisma.user.findMany({
		where: {
			gender: "MALE",
			email: {
				not: "admin@smashleague.com"
			},
			userRoles: {
				some: {
					role: {
						roleName: {
							notIn: [
								"Umpire",
								"Organizer",
								"Staff",
								"Admin"
							]
						}
					}
				}
			}
		}
	});
	console.log(participants.length);
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
