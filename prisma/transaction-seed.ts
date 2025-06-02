import { Prisma, PrismaClient, TeamStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	const users = await prisma.user.findMany({
		where: {
			email: {
				in: [
					"hoduongtrungnguyen@gmail.com",
					"nguyenhoangbao@gmail.com"
				]
			}
		}
	}); 
	console.log(users);
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
