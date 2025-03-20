import { Prisma, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	const roles = await prisma.role.findMany();
	const RoleMap = {
		Admin: { id: null, name: "Admin" },
		Organizer: { id: null, name: "Organizer" },
		Athlete: { id: null, name: "Athlete" },
		Team_Leader: { id: null, name: "Team Leader" },
		Umpire: { id: null, name: "Umpire" },
		Staff: { id: null, name: "Staff" },
	};

	const roleNameMapping = {
		"Team Leader": "Team_Leader",
	};
	
	roles.forEach((role) => {
		const mappedRoleName = roleNameMapping[role.roleName] || role.roleName;
		if (RoleMap[mappedRoleName]) {
			RoleMap[mappedRoleName].id = role.id;
		}
	});

	console.log(RoleMap);

	let accounts : Prisma.UserCreateInput[] = [
			{
				name: "Admin",
				email: "admin@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0123456789",
				isVerified: true
			}
		];
	// accounts.map(async (account) => {
	// 	await prisma.user.create({
	// 		data: account
	// 	});
	// })	
	await accounts.forEach(async (account) => {
		const accountCreate = await prisma.user.create({
			data: account
		});
		const userRole = await prisma.userRole.create({
			data: {
				userId: accountCreate.id,
				roleId: RoleMap["Admin"].id
			}
		});
		console.log(userRole);
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