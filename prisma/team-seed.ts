import { Prisma, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	const teamLeader = await prisma.user.findUnique({
		where: {
			email: "hoduongtrungnguyen@gmail.com",
		}
	});
	// const teamCreate: Prisma.TeamCreateManyInput = {
	// 	teamLeader: 
	// }
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
