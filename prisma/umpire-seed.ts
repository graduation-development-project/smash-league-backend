import { Prisma, PrismaClient, TeamStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	const umpires: Prisma.UserCreateManyInput[] = [		
		{
			name: "Trần Minh Quyền",
			email: "tranminhquyen@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0923747283",
			isVerified: true,
			gender: "MALE",
			avatarURL: "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"
		},				
		{
			name: "Đỗ Đăng Thanh Nhựt",
			email: "dodangthanhnhut@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0932745273",
			isVerified: true,
			gender: "MALE",
			avatarURL: "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"
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
	var accountCreates = [];
	for (const account of umpires) {
		const accountCreate = await prisma.user.create({
			data: account,
		});
		const userRoleUmpire = await prisma.userRole.create({
			data: {
				userId: accountCreate.id,
				roleId: RoleMap["Umpire"].id,
			},
		});
		const userRoleAthlete = await prisma.userRole.create({
			data: {
				userId: accountCreate.id,
				roleId: RoleMap["Athlete"].id
			}
		});
	}

	console.log(accountCreates);
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
