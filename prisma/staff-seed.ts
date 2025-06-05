import { Prisma, PrismaClient, TeamStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	const staffAccounts: Prisma.UserCreateManyInput[] = [
		{
			name: "Staff 1",
			email: "staff1@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0723923842",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Staff 2",
			email: "staff2@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0823764823",
			isVerified: true,
			gender: "FEMALE",
		},
	];

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
	const roleFromDBs = await prisma.role.findMany({
		select: {
			id: true,
			roleName: true,
		},
	});
	await new Promise((resolve) => setTimeout(resolve, 5000));

	roleFromDBs.forEach((role) => {
		const mappedRoleName = roleNameMapping[role.roleName] || role.roleName;
		if (RoleMap[mappedRoleName]) {
			RoleMap[mappedRoleName].id = role.id;
		}
	});

	console.log(RoleMap);

	for(let i = 0; i < staffAccounts.length; i++) {
		const staffAccount = await prisma.user.create({
			data: {
				...staffAccounts[i],
				avatarURL: "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"
			}
		});
		const staffRole = await prisma.userRole.create({
			data: {
				roleId: RoleMap.Staff.id,
				userId: staffAccount.id
			}
		});
	}
	
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
