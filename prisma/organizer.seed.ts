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

	let accounts : Prisma.UserCreateInput[] = [
		{
			name: "Organizer",
			email: "organizer@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0123812837",
			isVerified: true,
			gender: "MALE"							
		},
	];

	console.log(RoleMap);

	await accounts.forEach(async (account) => {
		const accountCreate = await prisma.user.create({
			data: account
		});
		
		const userRole = await prisma.userRole.create({
			data: {
				userId: accountCreate.id,
				roleId: RoleMap["Organizer"].id
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