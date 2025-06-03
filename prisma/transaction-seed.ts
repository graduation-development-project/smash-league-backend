import { OrderStatus, Prisma, PrismaClient, TeamStatus, TransactionStatus, TransactionType } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	await createOrganizerTransaction();
}

async function createOrganizerTransaction() {
	const packages = await prisma.package.findMany();
	const organizers = await prisma.user.findMany({
		where: {
			userRoles: {
				some: {
					role: {
						roleName: "Organizer"
					}
				}
			}
		}
	});
	var transactionsCreate: Prisma.TransactionCreateManyInput[] = [];
	for (let i = 0; i < organizers.length; i++) {
		const orderCreated = await prisma.order.create({
			data: {
				packageId: packages[1].id,
				orderStatus: OrderStatus.PAID,
				total: packages[1].price,
				userId: organizers[i].id
			}
		});
		transactionsCreate.push({
			userId: organizers[i].id,
			transactionType: TransactionType.BUYING_PAKCKAGE,
			createdAt: new Date(2024, 4, 31),
			status: TransactionStatus.SUCCESSFUL,
			value: packages[1].price,
			transactionDetail: "",
			orderId: orderCreated.id
		},
		{
			userId: organizers[i].id,
			transactionType: TransactionType.BUYING_PAKCKAGE,
			createdAt: new Date(2024, 4, 32),
			status: TransactionStatus.SUCCESSFUL,
			value: packages[1].price,
			transactionDetail: "",
			orderId: orderCreated.id
		});
		await prisma.user.update({
			where: {
				id: organizers[i].id
			},
			data: {
				creditsRemain: packages[1].credits * 2
			}
		});
	}
	console.log(transactionsCreate);
	const transactionCreated = await prisma.transaction.createManyAndReturn({
		data:  transactionsCreate
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
