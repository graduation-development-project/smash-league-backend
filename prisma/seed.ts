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
		{
			typeOfNotification: "Disband",
		},
		{
			typeOfNotification: "Kick",
		},
		{
			typeOfNotification: "Leave Team",
		},
		{
			typeOfNotification: "Join Team",
		},
		{
			typeOfNotification: "Transfer Team Leader",
		},
	];
	let packages : Prisma.PackageCreateInput[] = [
		{
			packageName: "Starter",
			packageDetail: "Package for starter with limited number of tournament to host!!",
			credits: 3,
			isAvailable: true,
			isRecommended: false,
			currentDiscountByAmount: 30000,
			price: 100000,
			advantages: [
				"Have 3 times to host a tournament with full options.",
				"Not availability to live stream."
			]
		},
		{
			packageName: "Pro",
			packageDetail: "Package for pro organizers with limited time of tournament hosting and unlimited functions.",
			credits: 10,
			isAvailable: true,
			isRecommended: true,
			currentDiscountByAmount: 100000,
			price: 300000,
			advantages: [
				"Have 10 times to host a tournament with full options.",
				"Availability to live stream."
			]
		},
		{
			packageName: "Starter",
			packageDetail: "Package for advanced organizers with amount number of tournaments to host!!",
			credits: 50,
			isAvailable: true,
			isRecommended: false,
			currentDiscountByAmount: 300000,
			price: 1000000,
			advantages: [
				"Have 50 times to host a tournament with full options.",
				"Availability to live stream."
			]
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

	packages.map(async (item) => {
		await prisma.package.create({
			data: item,
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
