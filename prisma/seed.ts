import { Prisma, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	let roles: Prisma.RoleCreateManyInput[] = [
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

	let notificationTypes: Prisma.NotificationTypeCreateManyInput[] = [
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
		{
			typeOfNotification: "Refund",
		},
	];
	let packages: Prisma.PackageCreateManyInput[] = [
		{
			packageName: "Starter",
			packageDetail:
				"Package for starter with limited number of tournament to host!!",
			credits: 3,
			isAvailable: true,
			isRecommended: false,
			currentDiscountByAmount: 100,
			price: 2000,
			advantages: [
				"Have 3 times to host a tournament with full options.",
				"Not availability to live stream.",
			],
		},
		{
			packageName: "Pro",
			packageDetail:
				"Package for pro organizers with limited time of tournament hosting and unlimited functions.",
			credits: 10,
			isAvailable: true,
			isRecommended: true,
			currentDiscountByAmount: 200,
			price: 4000,
			advantages: [
				"Have 10 times to host a tournament with full options.",
				"Availability to live stream.",
			],
		},
		{
			packageName: "Advanced",
			packageDetail:
				"Package for advanced organizers with amount number of tournaments to host!!",
			credits: 50,
			isAvailable: true,
			isRecommended: false,
			currentDiscountByAmount: 300,
			price: 5000,
			advantages: [
				"Have 50 times to host a tournament with full options.",
				"Availability to live stream.",
			],
		},
	];

	let accountAdmin: Prisma.UserCreateInput[] = [
		{
			name: "Admin",
			email: "admin@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0123456789",
			isVerified: true,
			gender: "MALE",
		},
	];

	// const user: User = await prisma.user.create({ data: userData });
	// await prisma.userRole.create({
	// 	data: { roleId: RoleMap.Athlete.id.toString(), userId: user.id },
	// });

	const rolesCreate = await prisma.role.createManyAndReturn({
		data: roles,
	});
	console.log(rolesCreate);
	// await roles.map(async (role) => {
	// 	await prisma.role.create({
	// 		data: {
	// 			...role
	// 		}
	// 	});
	// });

	// accounts.map(async (account) => {
	// 	const user = await prisma.user.create({
	// 		data: account
	// 	});
	// 	const userRole = await prisma.userRole.create({
	// 		data: {
	// 			userId: user.id,
	// 			roleId:
	// 		}
	// 	})
	// });

	// notificationType.map(async (type) => {
	// 	await prisma.notificationType.create({
	// 		data: type,
	// 	});
	// });
	const notificationTypesCreate =
		await prisma.notificationType.createManyAndReturn({
			data: notificationTypes,
		});

	const packagesCreate = await prisma.package.createManyAndReturn({
		data: packages,
	});

	// packages.map(async (item) => {
	// 	await prisma.package.create({
	// 		data: item,
	// 	});
	// });

	//account.seed
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
	console.log(roleFromDBs);

	roleFromDBs.forEach((role) => {
		const mappedRoleName = roleNameMapping[role.roleName] || role.roleName;
		if (RoleMap[mappedRoleName]) {
			RoleMap[mappedRoleName].id = role.id;
		}
	});

	console.log(RoleMap);

	let accounts: Prisma.UserCreateManyInput[] = [
		{
			name: "Trần Ánh Minh",
			email: "trananhminh@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "+84 9122792308",
			isVerified: true,
			gender: "FEMALE",
		},
		{
			name: "Phạm Vĩnh Sơn",
			email: "phamvinhson@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "018238102",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Hồ Dương Trung Nguyên",
			email: "hoduongtrungnguyen@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "7051174663",
			isVerified: true,
			gender: "MALE",
			dateOfBirth: "1990-05-15T10:30:00.000Z",
		},
		{
			name: "Trần Nguyệt Ánh",
			email: "trannguyetanh@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "8886135433",
			isVerified: true,
			gender: "FEMALE",
			dateOfBirth: "1990-05-15T10:30:00.000Z",
		},
		{
			name: "Nguyễn Ngọc Nghi",
			email: "nguyenngocnghi@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "1972443218",
			isVerified: true,
			gender: "FEMALE",
			dateOfBirth: "2003-11-17T10:30:00.000Z",
		},
		{
			name: "Nguyễn Hoàng Lam",
			email: "nguyenhoanglam@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "2667227290",
			isVerified: true,
			gender: "FEMALE",
		},
		{
			name: "Đỗ Đặng Phúc Anh",
			email: "dodangphucanh@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "7376821154",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Vũ Tùng Linh",
			email: "vutunglinh@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "3584872509",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Nguyễn Bùi Hải Anh",
			email: "nguyenbuihaianh@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "8536919478",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Phạm Hữu Anh Tài",
			email: "phamhuuanhtai@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0808269019",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Trần Đình Thiên Tân",
			email: "trandinhthientan@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "2546213970",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Tống Trần Lê Huy",
			email: "tongtranlehuy@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "4714673332",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Nguyễn Nhật Đức",
			email: "nguyennhatduc@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0100916254",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Nguyễn Thái Trung Kiên",
			email: "nguyenthaitrungkien@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "9674026073",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Nguyễn Trà My",
			email: "nguyentramy@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "5732109235",
			isVerified: true,
			gender: "FEMALE",
		},
		{
			name: "Nguyễn Khánh Linh",
			email: "nguyenkhanhlinh@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "5157185361",
			isVerified: true,
			gender: "FEMALE",
		},
		{
			name: "Võ Quốc Huy",
			email: "voquochuy@gmail.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "8847881723",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Phạm Thùy Linh",
			email: "phamthuylinh@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0981122334",
			isVerified: false,
			gender: "FEMALE",
		},
		{
			name: "Đỗ Quốc Bảo",
			email: "doquocbao@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0977654321",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Bùi Thị Cẩm Tiên",
			email: "buicamptien@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0934567890",
			isVerified: false,
			gender: "FEMALE",
		},
		{
			name: "Hoàng Tuấn Kiệt",
			email: "hoangtuanbiet@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0965432109",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Võ Hồng Nhung",
			email: "vohongnhung@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0943210987",
			isVerified: false,
			gender: "FEMALE",
		},
		{
			name: "Trịnh Công Thành",
			email: "trinhcongthanh@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0919988776",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Dương Thị Mỹ Hạnh",
			email: "duongmyhanh@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0977123456",
			isVerified: false,
			gender: "FEMALE",
		},
		{
			name: "Lý Văn Phúc",
			email: "lyvanphuc@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0922233445",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Ngô Minh Châu",
			email: "ngominhchau@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0933344556",
			isVerified: false,
			gender: "FEMALE",
		},
		{
			name: "Đặng Tiến Dũng",
			email: "dangtiendung@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0944455667",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Lâm Tấn Phát",
			email: "lamtanphat@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0955566778",
			isVerified: false,
			gender: "MALE",
		},
		{
			name: "Mai Thanh Hằng",
			email: "maithanhhang@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0966677889",
			isVerified: true,
			gender: "FEMALE",
		},
		{
			name: "Hồ Trọng Nhân",
			email: "hotrongnhan@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0977788990",
			isVerified: false,
			gender: "MALE",
		},
		{
			name: "Cao Thị Thu Hà",
			email: "caothithuha@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0988899001",
			isVerified: true,
			gender: "FEMALE",
		},
		{
			name: "Lương Nhật Quang",
			email: "luongnhatquang@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0999900112",
			isVerified: false,
			gender: "MALE",
		},
		{
			name: "Tống Gia Bảo",
			email: "tonggiabao@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0910111213",
			isVerified: true,
			gender: "MALE",
		},
		{
			name: "Vương Thanh Trúc",
			email: "vuongthanhtruc@example.com",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0921222324",
			isVerified: false,
			gender: "FEMALE",
		}
	];

	const adminAccount: Prisma.UserCreateManyInput = 
	{
		name: "Admin",
		email: "admin@smashleague.com",
		password: await bcrypt.hash("12345678", 10),
		phoneNumber: "0921238324",
		isVerified: true,
		gender: "MALE",
	};

	const admninCreate = await prisma.user.create({
		data: adminAccount
	});

	// const accountCreates = accounts.forEach(async (account) => {

	// });
	var accountCreates = [];
	for (const account of accounts) {
		const accountCreate = await prisma.user.create({
			data: account,
		});
		accountCreates.push(accountCreate);
		if (accountCreate.name === "Admin") {
			const userRole = await prisma.userRole.create({
				data: {
					userId: accountCreate.id,
					roleId: RoleMap["Admin"].id,
				},
			});
		} else if (accountCreate.email === "dodangphucanh@gmail.com") {
			const userRole = await prisma.userRole.create({
				data: {
					userId: accountCreate.id,
					roleId: RoleMap["Staff"].id,
				},
			});
		} else {
			const userRole = await prisma.userRole.create({
				data: {
					userId: accountCreate.id,
					roleId: RoleMap["Athlete"].id,
				},
			});
			console.log(userRole);
		}

		if (accountCreate.email === "hoduongtrungnguyen@gmail.com") {
			const userRole = await prisma.userRole.create({
				data: {
					userId: accountCreate.id,
					roleId: RoleMap["Organizer"].id,
				},
			});
		}
	}
	console.log(accountCreates);

	// //organizer.seed

	// let organizers : Prisma.UserCreateInput[] = [
	// 		{
	// 			name: "Organizer",
	// 			email: "organizer@gmail.com",
	// 			password: await bcrypt.hash("12345678", 10),
	// 			phoneNumber: "0123812837",
	// 			isVerified: true,
	// 			gender: "MALE"
	// 		},
	// 	];

	// await organizers.forEach(async (account) => {
	// 	const accountCreate = await prisma.user.create({
	// 		data: account
	// 	});

	// 	const userRole = await prisma.userRole.create({
	// 		data: {
	// 			userId: accountCreate.id,
	// 			roleId: RoleMap["Organizer"].id
	// 		}
	// 	});
	// 	console.log(userRole);
	// });
	const user = await prisma.user.findUnique({
		where: {
			email: "hoduongtrungnguyen@gmail.com",
		},
	});
	console.log(user);

	const tournamentSeries: Prisma.TournamentSerieCreateManyInput[] = [
		{
			tournamentSerieName: "2025",
			serieBackgroundImageURL: "",
			belongsToUserId: user.id,
		},
		{
			tournamentSerieName: "2024",
			serieBackgroundImageURL: "",
			belongsToUserId: user.id,
		},
	];

	const tournamentSeriesCreate =
		await prisma.tournamentSerie.createManyAndReturn({
			data: tournamentSeries,
		});

	const tournamentSerie = await prisma.tournamentSerie.findFirst({
		where: {
			tournamentSerieName: "2025",
		},
	});

	const tournaments: Prisma.TournamentCreateManyInput[] = [
		{
			id: "vietnam-open-2025",
			name: "Vietnam Open 2025",
			shortName: "VNO 2025",
			description: "Giải cầu lông quốc tế tổ chức tại Việt Nam",
			organizerId: user.id,
			contactPhone: "+84 912345678",
			contactEmail: "contact@vietnamopen.com",
			mainColor: "#FF5733",
			backgroundTournament: "https://example.com/images/vno_2025.jpg",
			location: "Hà Nội, Việt Nam",
			registrationOpeningDate: "2025-06-01T00:00:00Z",
			registrationClosingDate: "2025-06-30T23:59:59Z",
			drawDate: "2025-07-05T12:00:00Z",
			startDate: "2025-07-10T08:00:00Z",
			endDate: "2025-07-15T20:00:00Z",
			checkInBeforeStart: "2025-07-10T07:00:00Z",
			umpirePerMatch: 1,
			numberOfCourt: 3,
			registrationFeePerPerson: 500000,
			registrationFeePerPair: 900000,
			maxEventPerPerson: 3,
			status: "OPENING_FOR_REGISTRATION",
			protestFeePerTime: 200000,
			prizePool: 50000000,
			hasMerchandise: true,
			numberOfMerchandise: 500,
			merchandiseImages: [
				"https://example.com/images/merch_vno_1.jpg",
				"https://example.com/images/merch_vno_2.jpg",
			],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"],
			isRecruit: false,
			isPrivate: false,
			isRegister: true,
			isLiveDraw: true,
			hasLiveStream: true,
			tournamentSerieId: tournamentSerie.id,
		},
		{
			id: "asia-badminton-championship-2025",
			name: "Asia Badminton Championship 2025",
			shortName: "ABC 2025",
			description: "Giải vô địch cầu lông châu Á",
			organizerId: user.id,
			contactPhone: "+65 98765432",
			contactEmail: "info@asiabadminton.com",
			mainColor: "#4287F5",
			backgroundTournament: "https://example.com/images/abc_2025.jpg",
			location: "Singapore Indoor Stadium",
			registrationOpeningDate: "2025-08-01T00:00:00Z",
			registrationClosingDate: "2025-08-20T23:59:59Z",
			drawDate: "2025-08-25T12:00:00Z",
			startDate: "2025-09-01T08:00:00Z",
			endDate: "2025-09-07T20:00:00Z",
			checkInBeforeStart: "2025-09-01T07:00:00Z",
			umpirePerMatch: 1,
			numberOfCourt: 3,
			registrationFeePerPerson: 800000,
			registrationFeePerPair: 1500000,
			maxEventPerPerson: 2,
			status: "ON_GOING",
			protestFeePerTime: 300000,
			prizePool: 100000000,
			hasMerchandise: true,
			numberOfMerchandise: 300,
			merchandiseImages: [
				"https://example.com/images/merch_abc_1.jpg",
				"https://example.com/images/merch_abc_2.jpg",
			],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"],
			isRecruit: true,
			isPrivate: true,
			isRegister: true,
			isLiveDraw: false,
			hasLiveStream: true,
			tournamentSerieId: tournamentSerie.id,
		},
		{
			id: "european-badminton-masters-2025",
			name: "European Badminton Masters 2025",
			shortName: "EBM 2025",
			description:
				"Giải cầu lông đẳng cấp dành cho các tay vợt chuyên nghiệp châu Âu",
			organizerId: user.id,
			contactPhone: "+44 123456789",
			contactEmail: "support@europeanmasters.com",
			mainColor: "#12A345",
			backgroundTournament: "https://example.com/images/ebm_2025.jpg",
			location: "London, UK",
			registrationOpeningDate: "2025-09-10T00:00:00Z",
			registrationClosingDate: "2025-09-30T23:59:59Z",
			drawDate: "2025-10-05T12:00:00Z",
			startDate: "2025-10-10T08:00:00Z",
			endDate: "2025-10-15T20:00:00Z",
			checkInBeforeStart: "2025-10-10T07:00:00Z",
			umpirePerMatch: 1,
			numberOfCourt: 3,
			registrationFeePerPerson: 700000,
			registrationFeePerPair: 1300000,
			maxEventPerPerson: 3,
			status: "OPENING_FOR_REGISTRATION",
			protestFeePerTime: 250000,
			prizePool: 75000000,
			hasMerchandise: true,
			numberOfMerchandise: 400,
			merchandiseImages: [
				"https://example.com/images/merch_ebm_1.jpg",
				"https://example.com/images/merch_ebm_2.jpg",
			],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"],
			isRecruit: false,
			isPrivate: false,
			isRegister: false,
			isLiveDraw: false,
			hasLiveStream: true,
			tournamentSerieId: tournamentSerie.id,
		},
		{
			id: "japan-open-2025",
			name: "Japan Open 2025",
			shortName: "JPO 2025",
			description: "Giải cầu lông quốc tế diễn ra tại Nhật Bản",
			organizerId: user.id,
			contactPhone: "+81 987654321",
			contactEmail: "support@japanopen.com",
			mainColor: "#F54242",
			backgroundTournament: "https://example.com/images/jpo_2025.jpg",
			location: "Tokyo, Nhật Bản",
			registrationOpeningDate: "2025-04-01T00:00:00Z",
			registrationClosingDate: "2025-04-20T23:59:59Z",
			drawDate: "2025-04-25T12:00:00Z",
			startDate: "2025-05-01T08:00:00Z",
			endDate: "2025-05-07T20:00:00Z",
			checkInBeforeStart: "2025-05-01T07:00:00Z",
			umpirePerMatch: 1,
			numberOfCourt: 3,

			registrationFeePerPerson: 600000,
			registrationFeePerPair: 1100000,
			maxEventPerPerson: 3,
			status: "DRAWING",
			protestFeePerTime: 250000,
			prizePool: 85000000,
			hasMerchandise: true,
			numberOfMerchandise: 350,
			merchandiseImages: [
				"https://example.com/images/merch_jpo_1.jpg",
				"https://example.com/images/merch_jpo_2.jpg",
			],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"],
			isRecruit: false,
			isPrivate: false,
			isRegister: true,
			isLiveDraw: true,
			hasLiveStream: true,
			tournamentSerieId: tournamentSerie.id,
		},
	];

	const tournamentCreates = await prisma.tournament.createManyAndReturn({
		data: tournaments,
	});

	const tournament = await prisma.tournament.findFirst({
		where: {
			name: "European Badminton Masters 2025",
		},
	});

	const tournamentEvents: Prisma.TournamentEventCreateManyInput[] = [
		{
			tournamentEvent: "MENS_SINGLE",
			fromAge: 16,
			toAge: 35,
			winningPoint: 21,
			lastPoint: 31,
			numberOfGames: 3,
			typeOfFormat: "SINGLE_ELIMINATION",
			ruleOfEventExtension: "Players must reach 2 winning sets to advance.",
			minimumAthlete: 8,
			maximumAthlete: 64,
			championshipPrize: "Gold Medal, 8,000 USD",
			runnerUpPrize: "Silver Medal 4,000 USD",
			thirdPlacePrize: "Bronze Medal, 2,000 USD",
			jointThirdPlacePrize: "Consolation Prize, 1,000 USD",
			tournamentId: tournament.id,
		},
		{
			tournamentEvent: "WOMENS_SINGLE",
			fromAge: 14,
			toAge: 30,
			winningPoint: 21,
			lastPoint: 31,
			numberOfGames: 3,
			typeOfFormat: "SINGLE_ELIMINATION",
			ruleOfEventExtension:
				"Top 2 players from each group advance to knockout stage.",
			minimumAthlete: 6,
			maximumAthlete: 32,
			championshipPrize: "Gold Medal, 8,000 USD",
			runnerUpPrize: "Silver Medal 4,000 USD",
			thirdPlacePrize: "Bronze Medal, 2,000 USD",
			jointThirdPlacePrize: "Consolation Prize, 1,000 USD",
			tournamentId: tournament.id,
		},
		{
			tournamentEvent: "MENS_DOUBLE",
			fromAge: 18,
			toAge: 40,
			winningPoint: 21,
			lastPoint: 31,
			numberOfGames: 3,
			typeOfFormat: "SINGLE_ELIMINATION",
			ruleOfEventExtension: "Matches are best of 3 sets.",
			minimumAthlete: 4,
			maximumAthlete: 32,
			championshipPrize: "Gold Medal, 8,000 USD",
			runnerUpPrize: "Silver Medal 4,000 USD",
			thirdPlacePrize: "Bronze Medal, 2,000 USD",
			jointThirdPlacePrize: "Consolation Prize, 1,000 USD",
			tournamentId: tournament.id,
		},
		{
			tournamentEvent: "WOMENS_DOUBLE",
			fromAge: 16,
			toAge: 35,
			winningPoint: 21,
			lastPoint: 31,
			numberOfGames: 3,
			typeOfFormat: "SINGLE_ELIMINATION",
			ruleOfEventExtension:
				"Each team must play all group matches before knockout stage.",
			minimumAthlete: 4,
			maximumAthlete: 16,
			championshipPrize: "Gold Medal, 8,000 USD",
			runnerUpPrize: "Silver Medal 4,000 USD",
			thirdPlacePrize: "Bronze Medal, 2,000 USD",
			jointThirdPlacePrize: "Consolation Prize, 1,000 USD",
			tournamentId: tournament.id,
		},
		{
			tournamentEvent: "MIXED_DOUBLE",
			fromAge: 16,
			toAge: 40,
			winningPoint: 21,
			lastPoint: 31,
			numberOfGames: 3,
			typeOfFormat: "SINGLE_ELIMINATION",
			ruleOfEventExtension:
				"Mixed teams must consist of 1 male and 1 female player.",
			minimumAthlete: 8,
			maximumAthlete: 32,
			championshipPrize: "Gold Medal, 8,000 USD",
			runnerUpPrize: "Silver Medal 4,000 USD",
			thirdPlacePrize: "Bronze Medal, 2,000 USD",
			jointThirdPlacePrize: "Consolation Prize, 1,000 USD",
			tournamentId: tournament.id,
		},
		{
			tournamentEvent: "MENS_SINGLE",
			fromAge: 12,
			toAge: 18,
			winningPoint: 21,
			lastPoint: 31,
			numberOfGames: 3,
			typeOfFormat: "SINGLE_ELIMINATION",
			ruleOfEventExtension:
				"Youth players are allowed to compete in 2 events max.",
			minimumAthlete: 6,
			maximumAthlete: 20,
			championshipPrize: "Gold Medal, 8,000 USD",
			runnerUpPrize: "Silver Medal 4,000 USD",
			thirdPlacePrize: "Bronze Medal, 2,000 USD",
			jointThirdPlacePrize: "Consolation Prize, 1,000 USD",
			tournamentId: tournament.id,
		},
		{
			tournamentEvent: "WOMENS_SINGLE",
			fromAge: 10,
			toAge: 16,
			winningPoint: 21,
			lastPoint: 31,
			numberOfGames: 3,
			typeOfFormat: "SINGLE_ELIMINATION",
			ruleOfEventExtension: "Junior category follows simplified rules.",
			minimumAthlete: 8,
			maximumAthlete: 24,
			championshipPrize: "Gold Medal, 8,000 USD",
			runnerUpPrize: "Silver Medal 4,000 USD",
			thirdPlacePrize: "Bronze Medal, 2,000 USD",
			jointThirdPlacePrize: "Consolation Prize, 1,000 USD",
			tournamentId: tournament.id,
		},
		{
			tournamentEvent: "MENS_DOUBLE",
			fromAge: 20,
			toAge: 45,
			winningPoint: 21,
			lastPoint: 31,
			numberOfGames: 3,
			typeOfFormat: "SINGLE_ELIMINATION",
			ruleOfEventExtension: "Top 2 pairs in each group qualify for playoffs.",
			minimumAthlete: 4,
			maximumAthlete: 16,
			championshipPrize: "Gold Medal, 8,000 USD",
			runnerUpPrize: "Silver Medal 4,000 USD",
			thirdPlacePrize: "Bronze Medal, 2,000 USD",
			jointThirdPlacePrize: "Consolation Prize, 1,000 USD",
			tournamentId: tournament.id,
		},
		{
			tournamentEvent: "WOMENS_DOUBLE",
			fromAge: 22,
			toAge: 40,
			winningPoint: 21,
			lastPoint: 31,
			numberOfGames: 3,
			typeOfFormat: "SINGLE_ELIMINATION",
			ruleOfEventExtension: "Only national-ranked players are eligible.",
			minimumAthlete: 6,
			maximumAthlete: 16,
			championshipPrize: "Gold Medal, 8,000 USD",
			runnerUpPrize: "Silver Medal 4,000 USD",
			thirdPlacePrize: "Bronze Medal, 2,000 USD",
			jointThirdPlacePrize: "Consolation Prize, 1,000 USD",
			tournamentId: tournament.id,
		},
		{
			tournamentEvent: "MIXED_DOUBLE",
			fromAge: 18,
			toAge: 35,
			winningPoint: 21,
			lastPoint: 31,
			numberOfGames: 3,
			typeOfFormat: "SINGLE_ELIMINATION",
			ruleOfEventExtension: "Mixed doubles require pre-registered pairs.",
			minimumAthlete: 8,
			maximumAthlete: 24,
			championshipPrize: "Gold Medal, 8,000 USD",
			runnerUpPrize: "Silver Medal 4,000 USD",
			thirdPlacePrize: "Bronze Medal, 2,000 USD",
			jointThirdPlacePrize: "Consolation Prize, 1,000 USD",
			tournamentId: tournament.id,
		},
	];

	const tournamentEventCreates =
		await prisma.tournamentEvent.createManyAndReturn({
			data: tournamentEvents,
		});
	console.log(tournamentEventCreates);

	for(let i = 1; i <= tournament.numberOfCourt; i++) {
		const createCourt = await prisma.court.create({
			data: {
				courtCode: "Court " + i.toString(),
				courtAvailable: true,
				tournamentId: tournament.id
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
