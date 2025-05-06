import { BadmintonParticipantType, Prisma, PrismaClient, TournamentEventStatus, TypeOfFormat } from "@prisma/client";
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

	const tournaments: Prisma.TournamentCreateManyInput[] = 
	[
		{
			id: "hcmc-open-2025",
			name: "Ho Chi Minh City Open 2025",
			shortName: "HCMCO 2025",
			description: "Giải cầu lông mở rộng thường niên tại TP. Hồ Chí Minh",
			organizerId: user.id,
			contactPhone: "+84 901234567", // VN Format
			contactEmail: "hcmcopen2025@gmail.com", // Gmail format
			mainColor: "#FF6B6B",
			backgroundTournament: "https://example.com/images/hcmc_open_bg.jpg",
			location: "Nhà thi đấu Phú Thọ, TP. Hồ Chí Minh, Việt Nam", // VN Location
			registrationOpeningDate: "2025-06-01T00:00:00Z",
			registrationClosingDate: "2025-06-20T23:59:59Z",
			drawDate: "2025-06-25T10:00:00Z",
			startDateFirstTime: "2025-07-01T09:00:00Z",
			endDateFirstTime: "2025-07-07T21:00:00Z",
			countUpdateOccurTime: 0,
			startDate: "2025-07-01T09:00:00Z",
			endDate: "2025-07-07T21:00:00Z",
			checkInBeforeStart: "2025-07-01T08:00:00Z",
			numberOfCourt: 4, // Included field, value varied
			registrationFeePerPerson: 300000,
			registrationFeePerPair: 550000,
			maxEventPerPerson: 3,
			status: "CREATED", // Assigned Status
			protestFeePerTime: 150000,
			prizePool: 50000000,
			hasMerchandise: true,
			numberOfMerchandise: 200,
			merchandiseImages: ["https://example.com/images/merch_hcmc_1.jpg"],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"], // Set attachments
			isRecruit: true, // Set to true
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "da-nang-challenge-2025",
			name: "Da Nang Badminton Challenge 2025",
			shortName: "DNC 2025",
			description: "Thử thách kỹ năng cầu lông tại thành phố biển Đà Nẵng",
			organizerId: user.id,
			contactPhone: "+84 988765432", // VN Format
			contactEmail: "danangchallenge2025@gmail.com", // Gmail format
			mainColor: "#4ECDC4",
			backgroundTournament: "https://example.com/images/danang_bg.jpg",
			location: "Cung thể thao Tiên Sơn, Đà Nẵng, Việt Nam", // VN Location
			registrationOpeningDate: "2025-07-15T00:00:00Z",
			registrationClosingDate: "2025-08-05T23:59:59Z",
			drawDate: "2025-08-10T14:00:00Z",
			startDateFirstTime: "2025-08-15T08:30:00Z",
			endDateFirstTime: "2025-08-20T19:30:00Z",
			countUpdateOccurTime: 0,
			startDate: "2025-08-15T08:30:00Z",
			endDate: "2025-08-20T19:30:00Z",
			checkInBeforeStart: "2025-08-15T07:30:00Z",
			numberOfCourt: 3, // Included field, value varied
			registrationFeePerPerson: 250000,
			registrationFeePerPair: 450000,
			maxEventPerPerson: 2,
			status: "CREATED", // Assigned Status
			protestFeePerTime: 100000,
			prizePool: 35000000,
			hasMerchandise: false,
			numberOfMerchandise: 0,
			merchandiseImages: [],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"], // Set attachments
			isRecruit: true, // Set to true
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "hanoi-masters-2025",
			name: "Hanoi Masters 2025",
			shortName: "HNM 2025",
			description: "Giải đấu quy tụ các tay vợt hàng đầu tại thủ đô Hà Nội",
			organizerId: user.id,
			contactPhone: "+84 351122334", // VN Format
			contactEmail: "hanoimasters.info@gmail.com", // Gmail format
			mainColor: "#F9A825",
			backgroundTournament: "https://example.com/images/hanoi_masters_bg.jpg",
			location: "Nhà thi đấu Trịnh Hoài Đức, Hà Nội, Việt Nam", // VN Location
			registrationOpeningDate: "2025-08-20T00:00:00Z",
			registrationClosingDate: "2025-09-10T23:59:59Z",
			drawDate: "2025-09-15T11:00:00Z",
			startDateFirstTime: "2025-09-22T09:00:00Z",
			endDateFirstTime: "2025-09-28T22:00:00Z",
			countUpdateOccurTime: 0,
			startDate: "2025-09-22T09:00:00Z",
			endDate: "2025-09-28T22:00:00Z",
			checkInBeforeStart: "2025-09-22T08:00:00Z",
			numberOfCourt: 5, // Included field, value varied
			registrationFeePerPerson: 400000,
			registrationFeePerPair: 700000,
			maxEventPerPerson: 3,
			status: "CREATED", // Assigned Status
			protestFeePerTime: 200000,
			prizePool: 70000000,
			hasMerchandise: true,
			numberOfMerchandise: 300,
			merchandiseImages: ["https://example.com/images/merch_hanoi_1.jpg", "https://example.com/images/merch_hanoi_2.jpg"],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"], // Set attachments
			isRecruit: true, // Set to true
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "can-tho-cup-2025",
			name: "Can Tho Badminton Cup 2025",
			shortName: "CTC 2025",
			description: "Giải cầu lông tranh cúp tại Cần Thơ, miền Tây sông nước",
			organizerId: user.id,
			contactPhone: "+84 777888999", // VN Format
			contactEmail: "canthobadmintoncup@gmail.com", // Gmail format
			mainColor: "#16A085",
			backgroundTournament: "https://example.com/images/cantho_cup_bg.jpg",
			location: "Nhà thi đấu đa năng Cần Thơ, Cần Thơ, Việt Nam", // VN Location
			registrationOpeningDate: "2025-10-01T00:00:00Z",
			registrationClosingDate: "2025-10-20T23:59:59Z",
			drawDate: "2025-10-25T09:00:00Z",
			startDateFirstTime: "2025-11-01T08:00:00Z",
			endDateFirstTime: "2025-11-05T20:00:00Z",
			countUpdateOccurTime: 0,
			startDate: "2025-11-01T08:00:00Z",
			endDate: "2025-11-05T20:00:00Z",
			checkInBeforeStart: "2025-11-01T07:00:00Z",
			numberOfCourt: 4, // Included field, value varied
			registrationFeePerPerson: 200000,
			registrationFeePerPair: 350000,
			maxEventPerPerson: 3,
			status: "CREATED", // Assigned Status
			protestFeePerTime: 100000,
			prizePool: 25000000,
			hasMerchandise: true,
			numberOfMerchandise: 150,
			merchandiseImages: ["https://example.com/images/merch_cantho_1.jpg"],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"], // Set attachments
			isRecruit: true, // Set to true
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "hai-phong-port-city-open-2025",
			name: "Hai Phong Port City Open 2025",
			shortName: "HPCO 2025",
			description: "Giải cầu lông thành phố Cảng Hải Phòng mở rộng",
			organizerId: user.id,
			contactPhone: "+84 936111222", // VN Format
			contactEmail: "haiphong.open@gmail.com", // Gmail format
			mainColor: "#E74C3C",
			backgroundTournament: "https://example.com/images/haiphong_bg.jpg",
			location: "Nhà thi đấu Lạch Tray, Hải Phòng, Việt Nam", // VN Location
			registrationOpeningDate: "2025-09-01T00:00:00Z",
			registrationClosingDate: "2025-09-30T23:59:59Z",
			drawDate: "2025-10-05T15:00:00Z",
			startDateFirstTime: "2025-10-12T10:00:00Z",
			endDateFirstTime: "2025-10-19T22:00:00Z",
			countUpdateOccurTime: 0,
			startDate: "2025-10-12T10:00:00Z",
			endDate: "2025-10-19T22:00:00Z",
			checkInBeforeStart: "2025-10-12T09:00:00Z",
			numberOfCourt: 3, // Included field, value varied
			registrationFeePerPerson: 350000,
			registrationFeePerPair: 650000,
			maxEventPerPerson: 2,
			status: "CREATED", // Assigned Status
			protestFeePerTime: 180000,
			prizePool: 60000000,
			hasMerchandise: true,
			numberOfMerchandise: 280,
			merchandiseImages: ["https://example.com/images/merch_hp_1.jpg", "https://example.com/images/merch_hp_2.jpg"],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"], // Set attachments
			isRecruit: true, // Set to true
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "hue-imperial-cup-2025",
			name: "Hue Imperial Cup 2025",
			shortName: "HIC 2025",
			description: "Giải cầu lông Cố đô Huế tranh cúp Hoàng Gia",
			organizerId: user.id,
			contactPhone: "+84 945987654", // VN Format
			contactEmail: "hueimperialcup@gmail.com", // Gmail format
			mainColor: "#F1C40F",
			backgroundTournament: "https://example.com/images/hue_bg.jpg",
			location: "Trung tâm thể thao Thừa Thiên Huế, Huế, Việt Nam", // VN Location
			registrationOpeningDate: "2025-04-15T00:00:00Z", // Reg started
			registrationClosingDate: "2025-05-05T23:59:59Z", // Reg closed yesterday (May 5th)
			drawDate: "2025-05-10T12:00:00Z", // Draw upcoming
			startDateFirstTime: "2025-05-15T09:00:00Z",
			endDateFirstTime: "2025-05-20T21:00:00Z",
			countUpdateOccurTime: 0,
			startDate: "2025-05-15T09:00:00Z",
			endDate: "2025-05-20T21:00:00Z",
			checkInBeforeStart: "2025-05-15T08:00:00Z",
			numberOfCourt: 4, // Included field, value varied
			registrationFeePerPerson: 280000,
			registrationFeePerPair: 500000,
			maxEventPerPerson: 2,
			status: "CLOSING_FOR_REGISTRATION", // Assigned Status (Reg closed)
			protestFeePerTime: 120000,
			prizePool: 45000000,
			hasMerchandise: true,
			numberOfMerchandise: 180,
			merchandiseImages: ["https://example.com/images/merch_hue_1.jpg"],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"], // Set attachments
			isRecruit: true, // Set to true
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "vietnam-youth-nationals-2025",
			name: "Vietnam Youth Nationals 2025",
			shortName: "VYN 2025",
			description: "Giải vô địch cầu lông trẻ quốc gia Việt Nam",
			organizerId: user.id,
			contactPhone: "+84 911223344", // VN Format
			contactEmail: "vbf.youthnationals@gmail.com", // Gmail format
			mainColor: "#3498DB",
			backgroundTournament: "https://example.com/images/vyn_bg.jpg",
			location: "Nhà thi đấu Bắc Giang, Bắc Giang, Việt Nam", // VN Location specified
			registrationOpeningDate: "2025-05-01T00:00:00Z", // Reg opened May 1st
			registrationClosingDate: "2025-05-25T23:59:59Z", // Reg closes later this month
			drawDate: "2025-05-28T10:00:00Z",
			startDateFirstTime: "2025-06-02T08:00:00Z",
			endDateFirstTime: "2025-06-10T18:00:00Z",
			countUpdateOccurTime: 0,
			startDate: "2025-06-02T08:00:00Z",
			endDate: "2025-06-10T18:00:00Z",
			checkInBeforeStart: "2025-06-02T07:00:00Z",
			numberOfCourt: 5, // Included field, value varied
			registrationFeePerPerson: 150000,
			registrationFeePerPair: 250000,
			maxEventPerPerson: 4,
			status: "OPENING_FOR_REGISTRATION", // Assigned Status (Reg is open now)
			protestFeePerTime: 50000,
			prizePool: 20000000,
			hasMerchandise: true,
			numberOfMerchandise: 100,
			merchandiseImages: ["https://example.com/images/merch_vyn.jpg"],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"], // Set attachments
			isRecruit: true, // Set to true
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "hcmc-club-challenge-spring-2025",
			name: "HCMC Club Challenge - Spring 2025",
			shortName: "HCCC Spr25",
			description: "Giải đấu giao hữu giữa các câu lạc bộ cầu lông tại TP.HCM - Mùa Xuân",
			organizerId: user.id,
			contactPhone: "+84 908765432", // VN Format
			contactEmail: "hcmc.clubchallenge@gmail.com", // Gmail format
			mainColor: "#E67E22",
			backgroundTournament: "https://example.com/images/hcmc_club_bg.jpg",
			location: "Câu lạc bộ Tao Đàn, TP. Hồ Chí Minh, Việt Nam", // VN Location
			registrationOpeningDate: "2025-02-01T00:00:00Z", // Past date
			registrationClosingDate: "2025-02-20T23:59:59Z", // Past date
			drawDate: "2025-02-22T18:00:00Z", // Past date
			startDateFirstTime: "2025-03-01T09:00:00Z", // Past date
			endDateFirstTime: "2025-03-02T17:00:00Z", // Past date
			countUpdateOccurTime: 0,
			startDate: "2025-03-01T09:00:00Z",
			endDate: "2025-03-02T17:00:00Z",
			checkInBeforeStart: "2025-03-01T08:30:00Z",
			numberOfCourt: 3, // Included field, value varied
			registrationFeePerPerson: 100000,
			registrationFeePerPair: 180000,
			maxEventPerPerson: 2,
			status: "FINISHED", // Assigned Status
			protestFeePerTime: 50000,
			prizePool: 5000000,
			hasMerchandise: false,
			numberOfMerchandise: 0,
			merchandiseImages: [],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"], // Set attachments
			isRecruit: true, // Set to true
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "vung-tau-beach-cup-2025",
			name: "Vung Tau Beach Cup 2025",
			shortName: "VTBC 2025",
			description: "Giải cầu lông thành phố biển Vũng Tàu",
			organizerId: user.id,
			contactPhone: "+84 967123789", // VN Format
			contactEmail: "vungtaubeachcup@gmail.com", // Gmail format
			mainColor: "#F54242",
			backgroundTournament: "https://example.com/images/vt_bg.jpg",
			location: "Nhà thi đấu Vũng Tàu, Bà Rịa - Vũng Tàu, Việt Nam", // VN Location
			registrationOpeningDate: "2025-04-10T00:00:00Z", // Adjusted Date
			registrationClosingDate: "2025-04-28T23:59:59Z", // Adjusted Date
			drawDate: "2025-04-30T12:00:00Z", // Adjusted Date
			startDateFirstTime: "2025-05-04T08:00:00Z", // Starts May 4th
			endDateFirstTime: "2025-05-10T20:00:00Z", // Ends May 10th (Current date May 6 is within)
			countUpdateOccurTime: 0,
			startDate: "2025-05-04T08:00:00Z",
			endDate: "2025-05-10T20:00:00Z",
			checkInBeforeStart: "2025-05-04T07:00:00Z",
			numberOfCourt: 4, // Included field, value varied
			registrationFeePerPerson: 250000,
			registrationFeePerPair: 450000,
			maxEventPerPerson: 3,
			status: "ON_GOING", // Assigned Status (Current date fits)
			protestFeePerTime: 100000,
			prizePool: 40000000,
			hasMerchandise: true,
			numberOfMerchandise: 150,
			merchandiseImages: ["https://example.com/images/merch_vt_1.jpg", "https://example.com/images/merch_vt_2.jpg"],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"], // Set attachments
			isRecruit: true, // Set to true
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "dong-nai-industrial-zone-cup-2025",
			name: "Dong Nai Industrial Zone Cup 2025",
			shortName: "DNIZC 2025",
			description: "Giải cầu lông các Khu Công nghiệp Đồng Nai",
			organizerId: user.id,
			contactPhone: "+84 918273645", // VN Format
			contactEmail: "dongnai.izcup@gmail.com", // Gmail format
			mainColor: "#8E44AD",
			backgroundTournament: "https://example.com/images/dn_bg.jpg",
			location: "Trung tâm TDTT Đồng Nai, Biên Hòa, Đồng Nai, Việt Nam", // VN Location
			registrationOpeningDate: "2025-03-01T00:00:00Z", // Past Date
			registrationClosingDate: "2025-03-25T23:59:59Z", // Past Date
			drawDate: "2025-03-30T11:00:00Z", // Past Date
			startDateFirstTime: "2025-04-08T09:00:00Z", // Past Date
			endDateFirstTime: "2025-04-13T20:00:00Z", // Past Date
			countUpdateOccurTime: 0,
			startDate: "2025-04-08T09:00:00Z",
			endDate: "2025-04-13T20:00:00Z",
			checkInBeforeStart: "2025-04-08T08:00:00Z",
			numberOfCourt: 4, // Included field, value varied
			registrationFeePerPerson: 150000,
			registrationFeePerPair: 280000,
			maxEventPerPerson: 2,
			status: "FINISHED", // Assigned Status
			protestFeePerTime: 60000,
			prizePool: 18000000,
			hasMerchandise: true,
			numberOfMerchandise: 90,
			merchandiseImages: ["https://example.com/images/merch_dn_1.jpg"],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"], // Set attachments
			isRecruit: true, // Set to true
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "nha-trang-beach-games-2025",
			name: "Nha Trang Beach Games Badminton 2025",
			shortName: "NTBG 2025",
			description: "Môn Cầu Lông trong Đại hội Thể thao Biển Nha Trang",
			organizerId: user.id,
			contactPhone: "+84 987654321", // VN Format
			contactEmail: "nhatrang.beachgames@gmail.com", // Gmail format
			mainColor: "#2ECC71",
			backgroundTournament: "https://example.com/images/nt_bg.jpg",
			location: "Trung tâm Dịch vụ TDTT Nha Trang, Khánh Hòa, Việt Nam", // VN Location
			registrationOpeningDate: "2025-04-20T00:00:00Z", // Adjusted date
			registrationClosingDate: "2025-05-15T23:59:59Z", // Adjusted date (Reg open)
			drawDate: "2025-05-18T14:00:00Z", // Adjusted date
			startDateFirstTime: "2025-05-22T10:00:00Z", // Adjusted date
			endDateFirstTime: "2025-05-28T21:00:00Z", // Adjusted date
			countUpdateOccurTime: 0,
			startDate: "2025-05-22T10:00:00Z",
			endDate: "2025-05-28T21:00:00Z",
			checkInBeforeStart: "2025-05-22T09:00:00Z",
			numberOfCourt: 5, // Included field, value varied
			registrationFeePerPerson: 300000,
			registrationFeePerPair: 550000,
			maxEventPerPerson: 2,
			status: "OPENING_FOR_REGISTRATION", // Assigned Status (Reg open)
			protestFeePerTime: 130000,
			prizePool: 55000000,
			hasMerchandise: true,
			numberOfMerchandise: 190,
			merchandiseImages: ["https://example.com/images/merch_nt_1.jpg", "https://example.com/images/merch_nt_2.jpg"],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"], // Set attachments
			isRecruit: true, // Set to true
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "binh-duong-invitational-2025",
			name: "Binh Duong Invitational 2025",
			shortName: "BDI 2025",
			description: "Giải cầu lông mời tỉnh Bình Dương mở rộng",
			organizerId: user.id,
			contactPhone: "+84 888111333", // VN Format
			contactEmail: "binhduong.invitational@gmail.com", // Gmail format
			mainColor: "#7F8C8D",
			backgroundTournament: "https://example.com/images/bdi_bg.jpg",
			location: "Nhà thi đấu tỉnh Bình Dương, Thủ Dầu Một, Việt Nam", // VN Location
			registrationOpeningDate: "2025-04-10T00:00:00Z", // Adjusted date
			registrationClosingDate: "2025-04-30T23:59:59Z", // Adjusted date (Reg closed)
			drawDate: "2025-05-03T09:00:00Z", // Adjusted date (Draw was a few days ago)
			startDateFirstTime: "2025-05-08T08:30:00Z", // Adjusted date (Starts soon)
			endDateFirstTime: "2025-05-12T19:00:00Z", // Adjusted date
			countUpdateOccurTime: 0,
			startDate: "2025-05-08T08:30:00Z",
			endDate: "2025-05-12T19:00:00Z",
			checkInBeforeStart: "2025-05-08T07:30:00Z",
			numberOfCourt: 3, // Included field, value varied
			registrationFeePerPerson: 220000,
			registrationFeePerPair: 400000,
			maxEventPerPerson: 3,
			status: "DRAWING", // Assigned Status (Between draw and start)
			protestFeePerTime: 80000,
			prizePool: 30000000,
			hasMerchandise: false,
			numberOfMerchandise: 0,
			merchandiseImages: [],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"], // Set attachments
			isRecruit: true, // Set to true
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "lam-dong-highland-challenge-2025",
			name: "Lam Dong Highland Challenge 2025",
			shortName: "LDHC 2025",
			description: "Thách thức cầu lông cao nguyên Lâm Đồng",
			organizerId: user.id,
			contactPhone: "+84 977888444", // VN Format
			contactEmail: "lamdong.challenge@gmail.com", // Gmail format
			mainColor: "#C0392B",
			backgroundTournament: "https://example.com/images/ld_bg.jpg",
			location: "Nhà thi đấu Đà Lạt, Lâm Đồng, Việt Nam", // VN Location
			registrationOpeningDate: "2025-04-18T00:00:00Z", // Adjusted date
			registrationClosingDate: "2025-05-08T23:59:59Z", // Adjusted date (Reg closes soon)
			drawDate: "2025-05-11T10:00:00Z", // Adjusted date
			startDateFirstTime: "2025-05-16T09:00:00Z", // Adjusted date
			endDateFirstTime: "2025-05-21T20:00:00Z", // Adjusted date
			countUpdateOccurTime: 0,
			startDate: "2025-05-16T09:00:00Z",
			endDate: "2025-05-21T20:00:00Z",
			checkInBeforeStart: "2025-05-16T08:00:00Z",
			numberOfCourt: 4, // Included field, value varied
			registrationFeePerPerson: 260000,
			registrationFeePerPair: 480000,
			maxEventPerPerson: 3,
			status: "CLOSING_FOR_REGISTRATION", // Assigned Status (Use second closing status)
			protestFeePerTime: 110000,
			prizePool: 38000000,
			hasMerchandise: true,
			numberOfMerchandise: 170,
			merchandiseImages: ["https://example.com/images/merch_ld_1.jpg"],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"], // Set attachments
			isRecruit: true, // Set to true
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "senior-nationals-vietnam-2025",
			name: "Vietnam Senior Nationals 2025",
			shortName: "VSN 2025",
			description: "Giải vô địch cầu lông người cao tuổi toàn quốc",
			organizerId: user.id,
			contactPhone: "+84 981122555", // VN Format
			contactEmail: "vbf.seniornationals@gmail.com", // Gmail format
			mainColor: "#2C3E50",
			backgroundTournament: "https://example.com/images/vsn_bg.jpg",
			location: "Nhà thi đấu Phan Chu Trinh, Nha Trang, Khánh Hòa, Việt Nam", // VN Location specified
			registrationOpeningDate: "2025-05-01T00:00:00Z", // Adjusted date
			registrationClosingDate: "2025-05-20T23:59:59Z", // Adjusted date (Reg open)
			drawDate: "2025-05-23T09:00:00Z", // Adjusted date
			startDateFirstTime: "2025-05-28T08:00:00Z", // Adjusted date
			endDateFirstTime: "2025-06-01T17:00:00Z", // Adjusted date
			countUpdateOccurTime: 0,
			startDate: "2025-05-28T08:00:00Z",
			endDate: "2025-06-01T17:00:00Z",
			checkInBeforeStart: "2025-05-28T07:00:00Z",
			numberOfCourt: 5, // Included field, value varied
			registrationFeePerPerson: 180000,
			registrationFeePerPair: 320000,
			maxEventPerPerson: 2,
			status: "DRAWING", // Assigned Status (Use second drawing status)
			protestFeePerTime: 70000,
			prizePool: 15000000,
			hasMerchandise: true,
			numberOfMerchandise: 80,
			merchandiseImages: ["https://example.com/images/merch_vsn.jpg"],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"], // Set attachments
			isRecruit: true, // Set to true
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "bac-lieu-wind-farm-open-2025",
			name: "Bac Lieu Wind Farm Open 2025",
			shortName: "BLWFO 2025",
			description: "Giải cầu lông mở rộng Điện gió Bạc Liêu",
			organizerId: user.id,
			contactPhone: "+84 789456123", // VN Format
			contactEmail: "baclieu.windfarm.open@gmail.com", // Gmail format
			mainColor: "#BDC3C7",
			backgroundTournament: "https://example.com/images/bl_bg.jpg",
			location: "Nhà thi đấu đa năng Bạc Liêu, Bạc Liêu, Việt Nam", // VN Location
			registrationOpeningDate: "2025-06-10T00:00:00Z",
			registrationClosingDate: "2025-06-30T23:59:59Z",
			drawDate: "2025-07-02T10:00:00Z",
			startDateFirstTime: "2025-07-08T09:00:00Z",
			endDateFirstTime: "2025-07-12T18:00:00Z",
			countUpdateOccurTime: 0,
			startDate: "2025-07-08T09:00:00Z",
			endDate: "2025-07-12T18:00:00Z",
			checkInBeforeStart: "2025-07-08T08:00:00Z",
			numberOfCourt: 4, // Included field, value varied
			registrationFeePerPerson: 190000,
			registrationFeePerPair: 340000,
			maxEventPerPerson: 3,
			status: "CANCELED", // Assigned Status
			protestFeePerTime: 90000,
			prizePool: 22000000,
			hasMerchandise: false,
			numberOfMerchandise: 0,
			merchandiseImages: [],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"], // Set attachments
			isRecruit: true, // Set to true
			tournamentSerieId: tournamentSerie.id
		}
	];

	const tournamentCreates = await prisma.tournament.createManyAndReturn({
		data: tournaments,
	});
	await createTournamentEventForHochiminh();
	await createTournamentEventForDaNang();
	await createTournamentEventForVietnam();
	await createTournamentEventForHanoi();
	await createTournamentEventForVungtau();
}

async function createTournamentEventForHochiminh() {
	const tournament = await prisma.tournament.findFirst({
		where: {
			name: "Ho Chi Minh City Open 2025",
		},
	});

	const eventMenSingle = {
		tournamentEvent: BadmintonParticipantType.MENS_SINGLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Players must win 2 out of 3 games to advance.",
    minimumAthlete: 4,
    maximumAthlete: 32,
    championshipPrize: "Gold Medal, 10,000,000 VND",
    runnerUpPrize: "Silver Medal, 5,000,000 VND",
    thirdPlacePrize: "Bronze Medal, 2,500,000 VND"
	};

	const eventMenDouble = {
		tournamentEvent: BadmintonParticipantType.MENS_DOUBLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Pairs must win 2 out of 3 games to advance.", // Changed Players to Pairs
    minimumAthlete: 4, // Minimum 4 pairs
    maximumAthlete: 32, // Maximum 32 pairs
    championshipPrize: "Gold Medal, 15,000,000 VND", // Slightly higher prize for doubles
    runnerUpPrize: "Silver Medal, 7,500,000 VND",
    thirdPlacePrize: "Bronze Medal, 3,500,000 VND"
	};

	const eventWomanSingle = {
		tournamentEvent: BadmintonParticipantType.WOMENS_SINGLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Players must win 2 out of 3 games to advance.",
    minimumAthlete: 4,
    maximumAthlete: 32,
    championshipPrize: "Gold Medal, 10,000,000 VND",
    runnerUpPrize: "Silver Medal, 5,000,000 VND",
    thirdPlacePrize: "Bronze Medal, 2,500,000 VND"
	};

	const eventWomanDouble = {
		tournamentEvent: BadmintonParticipantType.WOMENS_DOUBLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Pairs must win 2 out of 3 games to advance.", // Changed Players to Pairs
    minimumAthlete: 4, // Minimum 4 pairs
    maximumAthlete: 32, // Maximum 32 pairs
    championshipPrize: "Gold Medal, 15,000,000 VND", // Same as Men's Doubles
    runnerUpPrize: "Silver Medal, 7,500,000 VND",
    thirdPlacePrize: "Bronze Medal, 3,500,000 VND"
	};

	const eventMixedDouble = {
		tournamentEvent: BadmintonParticipantType.MIXED_DOUBLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Pairs must win 2 out of 3 games to advance.", // Changed Players to Pairs
    minimumAthlete: 4, // Minimum 4 pairs
    maximumAthlete: 32, // Maximum 32 pairs
    championshipPrize: "Gold Medal, 12,000,000 VND", // Prize between Singles and Doubles
    runnerUpPrize: "Silver Medal, 6,000,000 VND",
    thirdPlacePrize: "Bronze Medal, 3,000,000 VND"
	};

	const tournamentEvents: Prisma.TournamentEventCreateManyInput[] = [
		{
			...eventMenSingle,
			tournamentId: tournament.id,
			tournamentEventStatus: TournamentEventStatus.ENDED
		},
		{
			...eventMenDouble,
			tournamentId: tournament.id,
			tournamentEventStatus: TournamentEventStatus.ENDED
		},
		{
			...eventMixedDouble,
			tournamentId: tournament.id,
			tournamentEventStatus: TournamentEventStatus.ENDED
		},
	];

	const tournamentEventCreates =
		await prisma.tournamentEvent.createManyAndReturn({
			data: tournamentEvents,
		});

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

async function createTournamentEventForDaNang() {
	const tournament = await prisma.tournament.findFirst({
		where: {
			name: "Da Nang Badminton Challenge 2025",
		},
	});

	const eventMenSingle = {
		tournamentEvent: BadmintonParticipantType.MENS_SINGLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Players must win 2 out of 3 games to advance.",
    minimumAthlete: 4,
    maximumAthlete: 32,
    championshipPrize: "Gold Medal, 10,000,000 VND",
    runnerUpPrize: "Silver Medal, 5,000,000 VND",
    thirdPlacePrize: "Bronze Medal, 2,500,000 VND"
	};

	const eventMenDouble = {
		tournamentEvent: BadmintonParticipantType.MENS_DOUBLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Pairs must win 2 out of 3 games to advance.", // Changed Players to Pairs
    minimumAthlete: 4, // Minimum 4 pairs
    maximumAthlete: 32, // Maximum 32 pairs
    championshipPrize: "Gold Medal, 15,000,000 VND", // Slightly higher prize for doubles
    runnerUpPrize: "Silver Medal, 7,500,000 VND",
    thirdPlacePrize: "Bronze Medal, 3,500,000 VND"
	};

	const eventWomanSingle = {
		tournamentEvent: BadmintonParticipantType.WOMENS_SINGLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Players must win 2 out of 3 games to advance.",
    minimumAthlete: 4,
    maximumAthlete: 32,
    championshipPrize: "Gold Medal, 10,000,000 VND",
    runnerUpPrize: "Silver Medal, 5,000,000 VND",
    thirdPlacePrize: "Bronze Medal, 2,500,000 VND"
	};

	const eventWomanDouble = {
		tournamentEvent: BadmintonParticipantType.WOMENS_DOUBLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Pairs must win 2 out of 3 games to advance.", // Changed Players to Pairs
    minimumAthlete: 4, // Minimum 4 pairs
    maximumAthlete: 32, // Maximum 32 pairs
    championshipPrize: "Gold Medal, 15,000,000 VND", // Same as Men's Doubles
    runnerUpPrize: "Silver Medal, 7,500,000 VND",
    thirdPlacePrize: "Bronze Medal, 3,500,000 VND"
	};

	const eventMixedDouble = {
		tournamentEvent: BadmintonParticipantType.MIXED_DOUBLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Pairs must win 2 out of 3 games to advance.", // Changed Players to Pairs
    minimumAthlete: 4, // Minimum 4 pairs
    maximumAthlete: 32, // Maximum 32 pairs
    championshipPrize: "Gold Medal, 12,000,000 VND", // Prize between Singles and Doubles
    runnerUpPrize: "Silver Medal, 6,000,000 VND",
    thirdPlacePrize: "Bronze Medal, 3,000,000 VND"
	};

	const danangEvents: Prisma.TournamentEventCreateManyInput[] = [
		{
			...eventMenSingle,
			tournamentId: tournament.id,
		},
		{
			...eventMenDouble,
			tournamentId: tournament.id,
		},
		{
			...eventMixedDouble,
			tournamentId: tournament.id,
		},
	];

	const tournamentEventCreates =
		await prisma.tournamentEvent.createManyAndReturn({
			data: danangEvents,
		});

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

async function createTournamentEventForVietnam() {
	const tournament = await prisma.tournament.findFirst({
		where: {
			name: "Vietnam Youth Nationals 2025",
		},
	});

	const eventMenSingle = {
		tournamentEvent: BadmintonParticipantType.MENS_SINGLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Players must win 2 out of 3 games to advance.",
    minimumAthlete: 4,
    maximumAthlete: 32,
    championshipPrize: "Gold Medal, 10,000,000 VND",
    runnerUpPrize: "Silver Medal, 5,000,000 VND",
    thirdPlacePrize: "Bronze Medal, 2,500,000 VND"
	};

	const eventMenDouble = {
		tournamentEvent: BadmintonParticipantType.MENS_DOUBLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Pairs must win 2 out of 3 games to advance.", // Changed Players to Pairs
    minimumAthlete: 4, // Minimum 4 pairs
    maximumAthlete: 32, // Maximum 32 pairs
    championshipPrize: "Gold Medal, 15,000,000 VND", // Slightly higher prize for doubles
    runnerUpPrize: "Silver Medal, 7,500,000 VND",
    thirdPlacePrize: "Bronze Medal, 3,500,000 VND"
	};

	const eventWomanSingle = {
		tournamentEvent: BadmintonParticipantType.WOMENS_SINGLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Players must win 2 out of 3 games to advance.",
    minimumAthlete: 4,
    maximumAthlete: 32,
    championshipPrize: "Gold Medal, 10,000,000 VND",
    runnerUpPrize: "Silver Medal, 5,000,000 VND",
    thirdPlacePrize: "Bronze Medal, 2,500,000 VND"
	};

	const eventWomanDouble = {
		tournamentEvent: BadmintonParticipantType.WOMENS_DOUBLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Pairs must win 2 out of 3 games to advance.", // Changed Players to Pairs
    minimumAthlete: 4, // Minimum 4 pairs
    maximumAthlete: 32, // Maximum 32 pairs
    championshipPrize: "Gold Medal, 15,000,000 VND", // Same as Men's Doubles
    runnerUpPrize: "Silver Medal, 7,500,000 VND",
    thirdPlacePrize: "Bronze Medal, 3,500,000 VND"
	};

	const eventMixedDouble = {
		tournamentEvent: BadmintonParticipantType.MIXED_DOUBLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Pairs must win 2 out of 3 games to advance.", // Changed Players to Pairs
    minimumAthlete: 4, // Minimum 4 pairs
    maximumAthlete: 32, // Maximum 32 pairs
    championshipPrize: "Gold Medal, 12,000,000 VND", // Prize between Singles and Doubles
    runnerUpPrize: "Silver Medal, 6,000,000 VND",
    thirdPlacePrize: "Bronze Medal, 3,000,000 VND"
	};

	const tournamentEvents: Prisma.TournamentEventCreateManyInput[] = [
		{
			...eventMenSingle,
			tournamentId: tournament.id
		},
		{
			...eventMenDouble,
			tournamentId: tournament.id
		},
		{
			...eventMixedDouble,
			tournamentId: tournament.id,
		},
	];

	const tournamentEventCreates =
		await prisma.tournamentEvent.createManyAndReturn({
			data: tournamentEvents,
		});
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

async function createTournamentEventForHanoi() {
	const tournament = await prisma.tournament.findFirst({
		where: {
			name: "Hanoi Masters 2025",
		},
	});

	const eventMenSingle = {
		tournamentEvent: BadmintonParticipantType.MENS_SINGLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Players must win 2 out of 3 games to advance.",
    minimumAthlete: 4,
    maximumAthlete: 32,
    championshipPrize: "Gold Medal, 10,000,000 VND",
    runnerUpPrize: "Silver Medal, 5,000,000 VND",
    thirdPlacePrize: "Bronze Medal, 2,500,000 VND"
	};

	const eventMenDouble = {
		tournamentEvent: BadmintonParticipantType.MENS_DOUBLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Pairs must win 2 out of 3 games to advance.", // Changed Players to Pairs
    minimumAthlete: 4, // Minimum 4 pairs
    maximumAthlete: 32, // Maximum 32 pairs
    championshipPrize: "Gold Medal, 15,000,000 VND", // Slightly higher prize for doubles
    runnerUpPrize: "Silver Medal, 7,500,000 VND",
    thirdPlacePrize: "Bronze Medal, 3,500,000 VND"
	};

	const eventWomanSingle = {
		tournamentEvent: BadmintonParticipantType.WOMENS_SINGLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Players must win 2 out of 3 games to advance.",
    minimumAthlete: 4,
    maximumAthlete: 32,
    championshipPrize: "Gold Medal, 10,000,000 VND",
    runnerUpPrize: "Silver Medal, 5,000,000 VND",
    thirdPlacePrize: "Bronze Medal, 2,500,000 VND"
	};

	const eventWomanDouble = {
		tournamentEvent: BadmintonParticipantType.WOMENS_DOUBLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Pairs must win 2 out of 3 games to advance.", // Changed Players to Pairs
    minimumAthlete: 4, // Minimum 4 pairs
    maximumAthlete: 32, // Maximum 32 pairs
    championshipPrize: "Gold Medal, 15,000,000 VND", // Same as Men's Doubles
    runnerUpPrize: "Silver Medal, 7,500,000 VND",
    thirdPlacePrize: "Bronze Medal, 3,500,000 VND"
	};

	const eventMixedDouble = {
		tournamentEvent: BadmintonParticipantType.MIXED_DOUBLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Pairs must win 2 out of 3 games to advance.", // Changed Players to Pairs
    minimumAthlete: 4, // Minimum 4 pairs
    maximumAthlete: 32, // Maximum 32 pairs
    championshipPrize: "Gold Medal, 12,000,000 VND", // Prize between Singles and Doubles
    runnerUpPrize: "Silver Medal, 6,000,000 VND",
    thirdPlacePrize: "Bronze Medal, 3,000,000 VND"
	};

	const tournamentEvents: Prisma.TournamentEventCreateManyInput[] = [
		{
			...eventMenSingle,
			tournamentId: tournament.id
		},
		{
			...eventMenDouble,
			tournamentId: tournament.id
		},
		{
			...eventMixedDouble,
			tournamentId: tournament.id,
		},
	];

	const tournamentEventCreates =
		await prisma.tournamentEvent.createManyAndReturn({
			data: tournamentEvents,
		});

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
async function createTournamentEventForVungtau() {
	const tournament = await prisma.tournament.findFirst({
		where: {
			name: "Vung Tau Beach Cup 2025",
		},
	});

	const eventMenSingle = {
		tournamentEvent: BadmintonParticipantType.MENS_SINGLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Players must win 2 out of 3 games to advance.",
    minimumAthlete: 4,
    maximumAthlete: 32,
    championshipPrize: "Gold Medal, 10,000,000 VND",
    runnerUpPrize: "Silver Medal, 5,000,000 VND",
    thirdPlacePrize: "Bronze Medal, 2,500,000 VND"
	};

	const eventMenDouble = {
		tournamentEvent: BadmintonParticipantType.MENS_DOUBLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Pairs must win 2 out of 3 games to advance.", // Changed Players to Pairs
    minimumAthlete: 4, // Minimum 4 pairs
    maximumAthlete: 32, // Maximum 32 pairs
    championshipPrize: "Gold Medal, 15,000,000 VND", // Slightly higher prize for doubles
    runnerUpPrize: "Silver Medal, 7,500,000 VND",
    thirdPlacePrize: "Bronze Medal, 3,500,000 VND"
	};

	const eventWomanSingle = {
		tournamentEvent: BadmintonParticipantType.WOMENS_SINGLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Players must win 2 out of 3 games to advance.",
    minimumAthlete: 4,
    maximumAthlete: 32,
    championshipPrize: "Gold Medal, 10,000,000 VND",
    runnerUpPrize: "Silver Medal, 5,000,000 VND",
    thirdPlacePrize: "Bronze Medal, 2,500,000 VND"
	};

	const eventWomanDouble = {
		tournamentEvent: BadmintonParticipantType.WOMENS_DOUBLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Pairs must win 2 out of 3 games to advance.", // Changed Players to Pairs
    minimumAthlete: 4, // Minimum 4 pairs
    maximumAthlete: 32, // Maximum 32 pairs
    championshipPrize: "Gold Medal, 15,000,000 VND", // Same as Men's Doubles
    runnerUpPrize: "Silver Medal, 7,500,000 VND",
    thirdPlacePrize: "Bronze Medal, 3,500,000 VND"
	};

	const eventMixedDouble = {
		tournamentEvent: BadmintonParticipantType.MIXED_DOUBLE,
    fromAge: 18,
    toAge: 30,
    winningPoint: 21,
    lastPoint: 30,
    numberOfGames: 3,
    typeOfFormat: TypeOfFormat.SINGLE_ELIMINATION,
    ruleOfEventExtension: "Pairs must win 2 out of 3 games to advance.", // Changed Players to Pairs
    minimumAthlete: 4, // Minimum 4 pairs
    maximumAthlete: 32, // Maximum 32 pairs
    championshipPrize: "Gold Medal, 12,000,000 VND", // Prize between Singles and Doubles
    runnerUpPrize: "Silver Medal, 6,000,000 VND",
    thirdPlacePrize: "Bronze Medal, 3,000,000 VND"
	};

	const tournamentEvents: Prisma.TournamentEventCreateManyInput[] = [
		{
			...eventMenSingle,
			tournamentId: tournament.id
		},
		{
			...eventMenDouble,
			tournamentId: tournament.id
		},
		{
			...eventMixedDouble,
			tournamentId: tournament.id,
		},
	];

	const tournamentEventCreates =
		await prisma.tournamentEvent.createManyAndReturn({
			data: tournamentEvents,
		});

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
