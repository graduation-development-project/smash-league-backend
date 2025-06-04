import { BadmintonParticipantType, Gender, InvitationStatus, Prisma, PrismaClient, Role, TeamStatus, Tournament, TournamentRegistrationRole, TournamentRegistrationStatus, TournamentStatus, TypeOfFormat, User } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	await tournamentSeeding();
	await tournamentEventSeeding();
	await tournamentRegistrationSeeding();
	// await getAllRoles();
	// await getAthletes();
	await umpireTournamentSeeding();
	await createOrganizerVerifications();
}

async function createOrganizerVerifications() {
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
	console.log(organizers);
	var verifications: Prisma.UserVerificationCreateManyInput[] = [];
	for (let i = 0; i < organizers.length; i++) {
		verifications.push({
			userId: organizers[i].id,
			role: "Organizer",
			createdAt: new Date(2024, 2, 30),
			status: InvitationStatus.ACCEPTED,			
		});
	}
	const verificationsCreated = await prisma.userVerification.createManyAndReturn({
		data: verifications
	});
}

async function getAllRoles() {
	const roles = await prisma.role.findMany();
	console.log(roles.filter((item) => item.roleName === "Umpire")[0]);
}

async function getRole(roleName: string): Promise<Role> {
	const role = await prisma.role.findFirst({
		where: {
			roleName: roleName
		}
	});
	return role;
}

async function tournamentSeeding() {
	// const tournamentSerie = await prisma.tournamentSerie.findFirst();
	const user = await prisma.user.create({
		data: {
			email: "nguyenhoangbao@gmail.com",
			name: "Nguyễn Hoàng Bảo",
			password: await bcrypt.hash("12345678", 10),
			phoneNumber: "0862767232",
			isVerified: true,
			gender: "MALE"
		}
	});
	const organizerRole = await getRole("Organizer");
	const athleteRole = await getRole("Athlete");
	const userRoleCreated = await prisma.userRole.createManyAndReturn({
		data: [
			{
				userId: user.id,
				roleId: organizerRole.id
			},
			{
				userId: user.id,
				roleId: athleteRole.id
			}
		]
	});
	// const user = await prisma.user.findFirst({
	// 	where: {
	// 		email: "nguyenhoangbao@gmail.com"
	// 	}
	// });
	// const tournamentSerie = await prisma.tournamentSerie.findFirst({
	// 	where: {
	// 		belongsToUserId: user.id,
	// 		tournamentSerieName: "2024"
	// 	}
	// });
	const tournamentSerie = await prisma.tournamentSerie.create({
		data: {
			serieBackgroundImageURL: "",
			tournamentSerieName: "2024",
			belongsToUserId: user.id,
		}
	});
	const tournamentCreate: Prisma.TournamentCreateManyInput[] = [
		{
			id: "hanoi-open-2024",
			name: "Hanoi Open Badminton Tournament 2024",
			shortName: "HN Open 2024",
			description: "Giải đấu cầu lông mở rộng tổ chức tại thủ đô Hà Nội",
			organizerId: user.id, // same as before
			contactPhone: "+84 912345678",
			contactEmail: "hanoiopen2024@gmail.com",
			mainColor: "#F7B801",
			backgroundTournament: "https://st2.depositphotos.com/4112313/9124/v/950/depositphotos_91244926-stock-illustration-polygonal-professional-badminton-player-on.jpg",
			location: "Nhà thi đấu Cầu Giấy, Hà Nội, Việt Nam",
			registrationOpeningDate: "2024-02-01T00:00:00Z",
			registrationClosingDate: "2024-02-17T23:59:59Z",
			drawDate: "2024-02-18T10:00:00Z",
			startDateFirstTime: "2024-02-19T08:00:00Z",
			endDateFirstTime: "2024-02-20T18:00:00Z",
			countUpdateOccurTime: 0,
			startDate: "2024-02-19T08:00:00Z",
			endDate: "2024-02-20T18:00:00Z",
			checkInBeforeStart: "2024-04-10T07:00:00Z",
			numberOfCourt: 4,
			registrationFeePerPerson: 100000,
			registrationFeePerPair: 200000,
			maxEventPerPerson: 2,
			status: TournamentStatus.CREATED,
			protestFeePerTime: 50000,
			prizePool: 20000000,
			hasMerchandise: true,
			numberOfMerchandise: 200,
			merchandiseImages: [
				"https://example.com/images/shirt-front.png",
				"https://example.com/images/shirt-back.png"
			],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"],
			isRecruit: true,
			tournamentSerieId: tournamentSerie.id // same as before
		},
		{
			id: "hcm-spring-smash-2024",
			name: "Ho Chi Minh Spring Smash 2024",
			shortName: "HCM Smash 2024",
			description: "Mùa xuân rực lửa cùng giải đấu cầu lông tại TP.HCM",
			organizerId: user.id,
			contactPhone: "+84 901112233",
			contactEmail: "hcmsmash2024@gmail.com",
			mainColor: "#FF6B6B",
			backgroundTournament: "https://i.pinimg.com/736x/59/6a/d6/596ad678212cbb262949e57790931a59.jpg",
			location: "Nhà thi đấu Phú Thọ, TP. Hồ Chí Minh",
			registrationOpeningDate: "2024-03-01T00:00:00Z",
			registrationClosingDate: "2024-03-17T23:59:59Z",
			drawDate: "2024-03-18T15:00:00Z",
			startDateFirstTime: "2024-03-19T08:30:00Z",
			endDateFirstTime: "2024-03-20T18:00:00Z",
			countUpdateOccurTime: 0,
			startDate: "2024-03-19T08:30:00Z",
			endDate: "2024-03-20T18:00:00Z",
			checkInBeforeStart: "2024-03-10T07:30:00Z",
			numberOfCourt: 5,
			registrationFeePerPerson: 100000,
			registrationFeePerPair: 150000,
			maxEventPerPerson: 2,
			status: TournamentStatus.CREATED,
			protestFeePerTime: 50000,
			prizePool: 15000000,
			hasMerchandise: true,
			numberOfMerchandise: 100,
			merchandiseImages: ["https://example.com/images/hcm-shirt.jpg"],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"],
			isRecruit: false,
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "hue-heritage-cup-2024",
			name: "Hue Heritage Badminton Cup 2024",
			shortName: "Hue Cup 2024",
			description: "Giải cầu lông mang đậm bản sắc cố đô Huế",
			organizerId: user.id,
			contactPhone: "+84 912000111",
			contactEmail: "huecup2024@gmail.com",
			mainColor: "#8E44AD",
			backgroundTournament: "https://png.pngtree.com/thumb_back/fh260/back_our/20190619/ourmid/pngtree-promotional-red-badminton-background-material-image_140709.jpg",
			location: "Trung tâm thể thao Thừa Thiên Huế",
			registrationOpeningDate: "2024-04-01T00:00:00Z",
			registrationClosingDate: "2024-04-17T23:59:59Z",
			drawDate: "2024-04-18T13:00:00Z",
			startDateFirstTime: "2024-04-19T09:00:00Z",
			endDateFirstTime: "2024-04-20T17:30:00Z",
			countUpdateOccurTime: 0,
			startDate: "2024-04-19T09:00:00Z",
			endDate: "2024-04-20T17:30:00Z",
			checkInBeforeStart: "2024-05-05T08:00:00Z",
			numberOfCourt: 3,
			registrationFeePerPerson: 100000,
			registrationFeePerPair: 150000,
			maxEventPerPerson: 2,
			status: TournamentStatus.CREATED,
			protestFeePerTime: 80000,
			prizePool: 12000000,
			hasMerchandise: false,
			numberOfMerchandise: 0,
			merchandiseImages: [],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"],
			isRecruit: true,
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "cantho-delta-open-2024",
			name: "Can Tho Delta Open 2024",
			shortName: "CT Delta 2024",
			description: "Giải cầu lông mở rộng khu vực đồng bằng sông Cửu Long",
			organizerId: user.id,
			contactPhone: "+84 934567890",
			contactEmail: "canthodelta2024@gmail.com",
			mainColor: "#3498DB",
			backgroundTournament: "https://i.pinimg.com/736x/66/d8/4b/66d84b382469b234a1c021d2b407adcf.jpg",
			location: "Sân vận động Can Tho, TP. Cần Thơ",
			registrationOpeningDate: "2024-05-01T00:00:00Z",
			registrationClosingDate: "2024-05-17T23:59:59Z",
			drawDate: "2024-05-18T14:00:00Z",
			startDateFirstTime: "2024-05-19T08:00:00Z",
			endDateFirstTime: "2024-05-20T18:00:00Z",
			countUpdateOccurTime: 0,
			startDate: "2024-05-19T08:00:00Z",
			endDate: "2024-05-20T18:00:00Z",
			checkInBeforeStart: "2024-05-19T07:30:00Z",
			numberOfCourt: 6,
			registrationFeePerPerson: 220000,
			registrationFeePerPair: 400000,
			maxEventPerPerson: 3,
			status: TournamentStatus.CREATED,
			protestFeePerTime: 70000,
			prizePool: 18000000,
			hasMerchandise: true,
			numberOfMerchandise: 150,
			merchandiseImages: [
				"https://example.com/images/cantho-shirt-front.jpg",
				"https://example.com/images/cantho-shirt-back.jpg"
			],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"],
			isRecruit: true,
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "ha-noi-grand-prix-2024",
			name: "Ha Noi Grand Prix 2024",
			shortName: "HN Grand Prix",
			description: "Giải cầu lông đỉnh cao giữa lòng thủ đô Hà Nội",
			organizerId: user.id,
			contactPhone: "+84 909123456",
			contactEmail: "hanoi.grandprix2024@gmail.com",
			mainColor: "#1ABC9C",
			backgroundTournament: "https://png.pngtree.com/background/20210710/original/pngtree-badminton-competition-advertising-background-picture-image_1058140.jpg",
			location: "Nhà thi đấu Trịnh Hoài Đức, Hà Nội",
			registrationOpeningDate: "2024-06-01T00:00:00Z",
			registrationClosingDate: "2024-06-17T23:59:59Z",
			drawDate: "2024-06-18T10:00:00Z",
			startDateFirstTime: "2024-06-19T08:30:00Z",
			endDateFirstTime: "2024-06-20T19:30:00Z",
			countUpdateOccurTime: 0,
			startDate: "2024-06-19T08:30:00Z",
			endDate: "2024-06-20T19:30:00Z",
			checkInBeforeStart: "2024-06-19T07:00:00Z",
			numberOfCourt: 4,
			registrationFeePerPerson: 100000,
			registrationFeePerPair: 150000,
			maxEventPerPerson: 2,
			status: TournamentStatus.CREATED,
			protestFeePerTime: 60000,
			prizePool: 25000000,
			hasMerchandise: true,
			numberOfMerchandise: 120,
			merchandiseImages: ["https://example.com/images/hn-shirt.png"],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"],
			isRecruit: true,
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "vung-tau-beach-smash-2024",
			name: "Vung Tau Beach Smash 2024",
			shortName: "VT Smash",
			description: "Giải đấu thể thao sôi động bên bờ biển Vũng Tàu",
			organizerId: user.id,
			contactPhone: "+84 938444555",
			contactEmail: "vt.beachsmash2024@gmail.com",
			mainColor: "#F39C12",
			backgroundTournament: "https://t3.ftcdn.net/jpg/03/10/62/12/360_F_310621281_foEqKBGtGlNWFQRePgdF5BpLOFyTsnzO.jpg",
			location: "Sân cầu lông trung tâm, Vũng Tàu",
			registrationOpeningDate: "2024-07-01T00:00:00Z",
			registrationClosingDate: "2024-07-17T23:59:59Z",
			drawDate: "2024-07-18T15:00:00Z",
			startDateFirstTime: "2024-07-19T09:00:00Z",
			endDateFirstTime: "2024-07-20T17:00:00Z",
			countUpdateOccurTime: 0,
			startDate: "2024-07-19T09:00:00Z",
			endDate: "2024-07-20T17:00:00Z",
			checkInBeforeStart: "2024-07-10T08:00:00Z",
			numberOfCourt: 3,
			registrationFeePerPerson: 100000,
			registrationFeePerPair: 130000,
			maxEventPerPerson: 2,
			status: TournamentStatus.CREATED,
			protestFeePerTime: 70000,
			prizePool: 16000000,
			hasMerchandise: true,
			numberOfMerchandise: 90,
			merchandiseImages: ["https://example.com/images/beach-shirt.jpg"],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"],
			isRecruit: false,
			tournamentSerieId: tournamentSerie.id
		},
		{
			id: "binh-duong-open-2024",
			name: "Binh Duong Open Series 2024",
			shortName: "BD Open",
			description: "Sân chơi phong trào và chuyên nghiệp tại Bình Dương",
			organizerId: user.id,
			contactPhone: "+84 987654321",
			contactEmail: "bdopen2024@gmail.com",
			mainColor: "#9B59B6",
			backgroundTournament: "https://t3.ftcdn.net/jpg/04/84/86/42/360_F_484864213_3Qve2ufnWY7Wkqk9r6RXXVUbraC6lfvQ.jpg",
			location: "Nhà thi đấu tỉnh Bình Dương",
			registrationOpeningDate: "2024-08-01T00:00:00Z",
			registrationClosingDate: "2024-08-17T23:59:59Z",
			drawDate: "2024-08-18T13:30:00Z",
			startDateFirstTime: "2024-08-19T08:30:00Z",
			endDateFirstTime: "2024-08-20T19:00:00Z",
			countUpdateOccurTime: 0,
			startDate: "2024-08-19T08:30:00Z",
			endDate: "2024-08-20T19:00:00Z",
			checkInBeforeStart: "2024-08-20T07:30:00Z",
			numberOfCourt: 4,
			registrationFeePerPerson: 100000,
			registrationFeePerPair: 120000,
			maxEventPerPerson: 2,
			status: TournamentStatus.CREATED,
			protestFeePerTime: 65000,
			prizePool: 20000000,
			hasMerchandise: false,
			numberOfMerchandise: 0,
			merchandiseImages: [],
			requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"],
			isRecruit: true,
			tournamentSerieId: tournamentSerie.id
		},
		// Các bản ghi bổ sung từ tháng 09/2024 đến tháng 06/2025
		...Array.from({ length: 12 }, (_, i) => {
			const month = (i + 9) % 12 + 1;
			const year = month >= 8 ? 2024 : 2025;
			const paddedMonth = month.toString().padStart(2, '0');
			return {
				id: `giai-${paddedMonth}01`,
				name: `Giải Cầu Lông Tháng ${paddedMonth}/${year}`,
				shortName: `GCL ${paddedMonth}/${year.toString().slice(2)}`,
				description: `Giải tháng ${paddedMonth}/${year}`,
				organizerId: user.id,
				contactPhone: "+84 987654321",
				contactEmail: `gcl${paddedMonth}${year}@gmail.com`,
				mainColor: ["#3498DB", "#1ABC9C", "#2ECC71", "#F1C40F", "#E67E22"][i % 5],
				backgroundTournament: `https://example.com/image${i + 2}.jpg`,
				location: "Nhà thi đấu đa năng",
				registrationOpeningDate: `${year}-${paddedMonth}-01T00:00:00Z`,
				registrationClosingDate: `${year}-${paddedMonth}-17T23:59:59Z`,
				drawDate: `${year}-${paddedMonth}-18T13:30:00Z`,
				startDateFirstTime: `${year}-${paddedMonth}-19T08:30:00Z`,
				endDateFirstTime: `${year}-${paddedMonth}-20T19:00:00Z`,
				countUpdateOccurTime: 0,
				startDate: `${year}-${paddedMonth}-19T08:30:00Z`,
				endDate: `${year}-${paddedMonth}-20T19:00:00Z`,
				checkInBeforeStart: `${year}-${paddedMonth}-20T07:30:00Z`,
				numberOfCourt: 4 + (i % 3),
				registrationFeePerPerson: 100000,
				registrationFeePerPair: 120000,
				maxEventPerPerson: 2,
				status: TournamentStatus.CREATED,
				protestFeePerTime: 65000,
				prizePool: 20000000,
				hasMerchandise: false,
				numberOfMerchandise: 0,
				merchandiseImages: [],
				requiredAttachment: ["IDENTIFICATION_CARD", "PORTRAIT_PHOTO"],
				isRecruit: true,
				tournamentSerieId: tournamentSerie.id
			}})
	]; 
	console.log(tournamentCreate);
		const tournamentCreated = await prisma.tournament.createManyAndReturn({
		data: tournamentCreate
	});
	console.log(tournamentCreated);
}

async function tournamentEventSeeding() {
	const tournaments = await prisma.tournament.findMany({
		where: {
			id: { 
				in: [
					"hue-heritage-cup-2024",
					"cantho-delta-open-2024",
					"ha-noi-grand-prix-2024",
					"hcm-spring-smash-2024",
					"vung-tau-beach-smash-2024",
					"giai-1001",
					"giai-1101",
					"giai-1201",
					"giai-0101",
					"giai-0201",
					"giai-0301",
					"giai-0401",
					"giai-0501"
				]
			}
		}
	});
	console.log(tournaments.map((item) => item.id));

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
		// championshipPrize: "Gold Medal, 10,000,000 VND",
		// runnerUpPrize: "Silver Medal, 5,000,000 VND",
		// thirdPlacePrize: "Bronze Medal, 2,500,000 VND"
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
		// championshipPrize: "Gold Medal, 15,000,000 VND", // Slightly higher prize for doubles
		// runnerUpPrize: "Silver Medal, 7,500,000 VND",
		// thirdPlacePrize: "Bronze Medal, 3,500,000 VND"
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
		// championshipPrize: "Gold Medal, 10,000,000 VND",
		// runnerUpPrize: "Silver Medal, 5,000,000 VND",
		// thirdPlacePrize: "Bronze Medal, 2,500,000 VND"
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
		// championshipPrize: "Gold Medal, 15,000,000 VND", // Same as Men's Doubles
		// runnerUpPrize: "Silver Medal, 7,500,000 VND",
		// thirdPlacePrize: "Bronze Medal, 3,500,000 VND"
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
		// championshipPrize: "Gold Medal, 12,000,000 VND", // Prize between Singles and Doubles
		// runnerUpPrize: "Silver Medal, 6,000,000 VND",
		// thirdPlacePrize: "Bronze Medal, 3,000,000 VND"
	};	

	var tournamentEventCreate: Prisma.TournamentEventCreateManyInput[] = [];
	for (let i = 0; i < tournaments.length; i++) {
		tournamentEventCreate.push({
			...eventMenSingle,
			tournamentId: tournaments[i].id
		});
		tournamentEventCreate.push({
			...eventMenDouble,
			tournamentId: tournaments[i].id
		});
		tournamentEventCreate.push({
			...eventMixedDouble,
			tournamentId: tournaments[i].id
		});
	}
	console.log(tournamentEventCreate);
	const tournamentEventCreated = await prisma.tournamentEvent.createManyAndReturn({
		data: tournamentEventCreate
	});
}

async function tournamentRegistrationSeeding() {
	const tournaments = await prisma.tournament.findMany({
		where: {
			id: { 
				in: [
					"hue-heritage-cup-2024",
					"cantho-delta-open-2024",
					"ha-noi-grand-prix-2024",
					"hcm-spring-smash-2024",
					"vung-tau-beach-smash-2024",
					"giai-1001",
					"giai-1101",
					"giai-1201",
					"giai-0101",
					"giai-0201",
					"giai-0301",
					"giai-0401",
					"giai-0501"
				]
			}
		},
		select: {
			id: true,
			registrationOpeningDate: true,
			registrationClosingDate: true,
			tournamentEvents: {
				select: {
					id: true
				}
			}
		}
	});
	const athletes: User[] = await getAthletes();

	// const umpireCreate: Prisma.UserCreate
	var tournamentRegistrationCreate: Prisma.TournamentRegistrationCreateManyInput[] = [];
	var tournamentParticipantsCreate: Prisma.TournamentParticipantsCreateManyInput[] = [];
	for (let i = 0; i < tournaments.length; i++) {
		for (let j = 0; j < tournaments[i].tournamentEvents.length; j++) {
			for (let k = 0; k < athletes.length; k++) {
				tournamentRegistrationCreate.push({
					registrationRole: TournamentRegistrationRole.ATHLETE,
					tournamentEventId: tournaments[i].tournamentEvents[j].id,
					tournamentId: tournaments[i].id,
					userId: athletes[k].id,
					createdAt: await getRandomDate(tournaments[i].registrationOpeningDate, tournaments[i].registrationClosingDate),
					status: TournamentRegistrationStatus.APPROVED
				});
				tournamentParticipantsCreate.push({
					tournamentEventId: tournaments[i].tournamentEvents[j].id,
					tournamentId: tournaments[i].id,
					userId: athletes[k].id,
				})
			}
		}
	}
	console.log(tournamentRegistrationCreate);
	const tournamentRegistrationCreated = await prisma.tournamentRegistration.createManyAndReturn({
		data: tournamentRegistrationCreate
	});
	const tournamentParticipantsCreated = await prisma.tournamentParticipants.createMany({
		data: tournamentParticipantsCreate
	});
}

async function getAthletes(): Promise<any[]> {
	const athleteRole = await getRole("Athlete");
	const users = await prisma.user.findMany({
		where: {
			userRoles: {
				some: {
					roleId: athleteRole.id
				}
			}
		},
		take: 20
	});
	return users;
}

async function getRandomDate(startDate: Date, endDate: Date): Promise<Date> {
	const startTime = startDate.getTime();
	const endTime = endDate.getTime();
	const randomTime = startTime + Math.random() * (endTime - startTime);
	return new Date(randomTime);
}

async function umpireTournamentSeeding() {
	const tournaments = await prisma.tournament.findMany({
		where: {
			id: { 
				in: [
					"hue-heritage-cup-2024",
					"cantho-delta-open-2024",
					"ha-noi-grand-prix-2024",
					"hcm-spring-smash-2024",
					"vung-tau-beach-smash-2024",
					"giai-1001",
					"giai-1101",
					"giai-1201",
					"giai-0101",
					"giai-0201",
					"giai-0301",
					"giai-0401",
					"giai-0501"
				]
			}
		},
		select: {
			id: true,
			registrationOpeningDate: true,
			registrationClosingDate: true,
			tournamentEvents: {
				select: {
					id: true
				}
			}
		}
	});
	var umpires: Prisma.UserCreateManyInput[] = [
	];
	const names = [
		"Nguyễn Văn A", "Lê Thị B", "Phạm Quốc Cường", "Đỗ Thanh Hằng",
		"Vũ Minh Tuấn", "Ngô Nhật Linh", "Trịnh Hoàng Nam", "Hoàng Mỹ Linh", "Bùi Tuấn Kiệt"
	];

	const emails = [
		"nguyenvana@gmail.com", "lethib@gmail.com", "phamcuong@gmail.com",
		"dohang@gmail.com", "vuminhtuan@gmail.com", "ngonhatlinh@gmail.com", "trinhnam@gmail.com",
		"hoanglinh@gmail.com", "buituankiet@gmail.com"
	];

	const password = await bcrypt.hash("12345678", 10);


	const data = names.map((name, index) => ({
    name: name,
    email: emails[index],
    password: password,
    phoneNumber: getRandomPhone(index),
    isVerified: true,
    gender: getRandomGender(),
    dateOfBirth: getRandomDOB(),
  }));
	umpires.push(...data);

	console.log(umpires);
	const umpiresCreated = await prisma.user.createManyAndReturn({
		data: umpires
	});
	console.log(umpiresCreated);
	const umpireRole = await getRole("Umpire");
	const athleteRole = await getRole("Athlete");
	var userRoleCreate: Prisma.UserRoleCreateManyInput[] = [];
	var verifications: Prisma.UserVerificationCreateManyInput[] = [];
	for (let i = 0; i < umpiresCreated.length; i++) {
		verifications.push({
			userId: umpiresCreated[i].id,
			role: "Umpire",
			createdAt: new Date(2024, 2, 30),
			status: InvitationStatus.ACCEPTED,
		});
		userRoleCreate.push({
				userId: umpiresCreated[i].id,
				roleId: athleteRole.id
			},
			{
				userId: umpiresCreated[i].id,
				roleId: umpireRole.id
			}
		);
	}
	const userRoleCreated = await prisma.userRole.createManyAndReturn({
		data: userRoleCreate
	});
	const verificationsCreated = await prisma.userVerification.createManyAndReturn({
		data: verifications
	});
	var tournamentUmpiresCreate: Prisma.TournamentUmpiresCreateManyInput[] = [];
	var tournamentUmpiresRegistrationCreate: Prisma.TournamentRegistrationCreateManyInput[] = [];
	for (let i = 0; i < tournaments.length; i++) {
		umpiresCreated.forEach(async (item) => {
			tournamentUmpiresCreate.push({
				tournamentId: tournaments[i].id,
				userId: item.id,
				isAvailable: true
			});
			tournamentUmpiresRegistrationCreate.push({
				userId: item.id,
				tournamentId: tournaments[i].id,
				registrationRole: TournamentRegistrationRole.UMPIRE,
				createdAt: await getRandomDate(tournaments[i].registrationOpeningDate, tournaments[i].registrationClosingDate),
				status: TournamentRegistrationStatus.APPROVED
			});
		});
	}
	const tournamentUmpiresCreated = await prisma.tournamentUmpires.createManyAndReturn({
		data: tournamentUmpiresCreate
	});
	const tournamentUmpiresRegistrationCreated = await prisma.tournamentRegistration.createManyAndReturn({
		data: tournamentUmpiresRegistrationCreate
	});
}

function getRandomGender(): "MALE" | "FEMALE" {
  return Math.random() < 0.5 ? "MALE" : "FEMALE";
}

function getRandomPhone(index: number): string {
  // Example: +84 9122792308 + index
  const base = 912279230;
  return `+84 ${base + index}`;
}

function getRandomDOB(): Date {
  const now = new Date();
  const latestYear = now.getFullYear() - 18;
  const year = Math.floor(Math.random() * 10) + (latestYear - 10); // Age 18–28
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day);
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
