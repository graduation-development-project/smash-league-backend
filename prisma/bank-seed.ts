import { Prisma, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	// const response = await fetch("https://api.vietqr.io/v2/banks");
	// const data = await response.json();
	// // console.log(data.data);
	// let banks: Prisma.BankCreateManyInput[] = [];
	// for (let i = 0; i < data.data.length; i++) {
	// 	banks.push({
	// 		name: data.data[i].name,
	// 		code: data.data[i].code,
	// 		shortName: data.data[i].shortName,
	// 		logo: data.data[i].logo
	// 	});
	// }
	// // console.log(banks);
	// const banksAdded = await prisma.bank.createManyAndReturn({
	// 	data: banks
	// });
	const banksGet = await prisma.bank.findMany();
	if (banksGet.length !== 0) return;
	const response = await fetch("https://api.banklookup.net/api/bank/list");
	const data = await response.json();
	console.log(data.data);	
	let banks: Prisma.BankCreateManyInput[] = [];
	for (let i = 0; i < data.data.length; i++) {
		banks.push({
			name: data.data[i].name,
			code: data.data[i].code,
			shortName: data.data[i].short_name,
			logo: data.data[i].logo_url
		});
	}
	const banksAdded = await prisma.bank.createManyAndReturn({
			data: banks
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
