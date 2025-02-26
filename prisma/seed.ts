import { Prisma, PrismaClient } from "@prisma/client";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	let roles: Prisma.RoleCreateInput[] = [
		{
			roleName: "Admin",
		},
		{
			roleName: "Organizer",
		},
		{
			roleName: "Athlete",
		},
		{
			roleName: "Team Leader",
		},
		{
			roleName: "Umpire",
		},
		{
			roleName: "Staff",
		},
	];

	let notificationType: Prisma.NotificationTypeCreateInput[] = [
		{
			typeOfNotification: "Reject",
		},

		{
			typeOfNotification: "Approve",
		},
		{
			typeOfNotification: "Invitation",
		},
	];

	roles.map(async (role) => {
		await prisma.role.create({
			data: role,
		});
	});

	notificationType.map(async (type) => {
		await prisma.notificationType.create({
			data: type,
		});
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
