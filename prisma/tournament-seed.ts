import { Gender, Prisma, PrismaClient, TeamStatus, Tournament, TournamentRegistrationRole, TournamentStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	const tournamentSerie = await prisma.tournamentSerie.findFirst();
	const user = await prisma.user.create({
		data: {
			email: "nguyenhoangbao@gmail.com",
			name: "Nguyễn Hoàng Bảo",
			password: "12345678",
			phoneNumber: "0862767232"
		}
	});
	const tournamentCreate: Prisma.TournamentCreateManyInput[] = [
		{
			id: "hanoi-open-2025",
			name: "Hanoi Open Badminton Tournament 2025",
			shortName: "HN Open 2025",
			description: "Giải đấu cầu lông mở rộng tổ chức tại thủ đô Hà Nội",
			organizerId: user.id, // same as before
			contactPhone: "+84 912345678",
			contactEmail: "hanoiopen2025@gmail.com",
			mainColor: "#F7B801",
			backgroundTournament: "https://example.com/backgrounds/hanoi-open-2025.jpg",
			location: "Nhà thi đấu Cầu Giấy, Hà Nội, Việt Nam",
			registrationOpeningDate: "2024-02-01T00:00:00Z",
			registrationClosingDate: "2025-02-17T23:59:59Z",
			drawDate: "2025-04-05T10:00:00Z",
			startDateFirstTime: "2025-04-10T08:00:00Z",
			endDateFirstTime: "2025-04-15T18:00:00Z",
			countUpdateOccurTime: 0,
			startDate: "2025-04-10T08:00:00Z",
			endDate: "2025-04-15T18:00:00Z",
			checkInBeforeStart: "2025-04-10T07:00:00Z",
			numberOfCourt: 4,
			registrationFeePerPerson: 200000,
			registrationFeePerPair: 400000,
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
	]; 
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
