import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import {
	BadmintonParticipantType,
	Court,
	Tournament,
	TournamentEvent,
	User,
} from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IRequestUser } from "src/domain/interfaces/interfaces";
import { ICreateCourts } from "src/domain/interfaces/tournament/tournament.interface";
import {
	CreateTournament,
	CreateTournamentEventsDTO,
} from "src/domain/interfaces/tournament/tournament.validation";
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";
import { TournamentSerieRepositoryPort } from "src/domain/repositories/tournament-serie.repository.port";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";
import { UploadService } from "src/infrastructure/services/upload.service";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { CourtRepositoryPort } from "src/domain/repositories/court.repository.port";
import { UsersRepositoryPort } from "src/domain/repositories/users.repository.port";
import { TournamentTimeJobType } from "../../../infrastructure/enums/tournament-time-job.enum";
import { scheduleOrUpdateTournamentJob } from "../../../infrastructure/util/job/tournament-scheduler";

@Injectable()
export class CreateNewTournamentUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
		@Inject("TournamentSerieRepository")
		private readonly tournamentSerieRepository: TournamentSerieRepositoryPort,
		@Inject("TournamentEventRepository")
		private readonly tournamentEventRepository: TournamentEventRepositoryPort,
		@Inject("CourtRepository")
		private readonly courtRepository: CourtRepositoryPort,
		@Inject("UserRepository")
		private readonly userRepository: UsersRepositoryPort,
		private readonly uploadService: UploadService,
		@InjectQueue("tournamentQueue")
		private tournamentQueue: Queue,
	) {}

	async execute(
		request: IRequestUser,
		createTournament: CreateTournament,
	): Promise<ApiResponse<Tournament>> {
		var tournament: Tournament;
		// const folderName = `tournament-merchandise/${new Date().toISOString().split("T")[0]}`;

		// const imageUrls = await this.uploadService.uploadFiles(
		// 	merchandiseImages,
		// 	folderName,
		// 	""
		// );
		// console.log(merchandiseImages);
		const isExistTournament = await this.isExistTournament(createTournament.id);
		console.log(isExistTournament);
		if (isExistTournament === true)
			return new ApiResponse<null | undefined>(
				HttpStatus.BAD_REQUEST,
				"Tournament ID exists!",
				null,
			);
		const user = await this.userRepository.getUser(request.user.id);
		if (user.creditsRemain === null || user.creditsRemain === 0)
			return new ApiResponse<null | undefined>(
				HttpStatus.BAD_REQUEST,
				"Credit remain is 0.",
				null,
			);
		tournament = await this.createTournamentWithNoTournamentSerie(
			createTournament,
			request.user,
		);

		const minusCreditAfterCreate = await this.userRepository.minusCredit(
			request.user.id,
		);

		await scheduleOrUpdateTournamentJob(
			this.tournamentQueue,
			TournamentTimeJobType.OPEN_REGISTRATION,
			tournament.id,
			tournament.registrationOpeningDate,
		);

		await scheduleOrUpdateTournamentJob(
			this.tournamentQueue,
			TournamentTimeJobType.CLOSE_REGISTRATION,
			tournament.id,
			tournament.registrationClosingDate,
		);

		await scheduleOrUpdateTournamentJob(
			this.tournamentQueue,
			TournamentTimeJobType.DRAW_DATE,
			tournament.id,
			tournament.drawDate,
		);

		await scheduleOrUpdateTournamentJob(
			this.tournamentQueue,
			TournamentTimeJobType.START_TOURNAMENT,
			tournament.id,
			tournament.startDate,
		);

		await scheduleOrUpdateTournamentJob(
			this.tournamentQueue,
			TournamentTimeJobType.END_TOURNAMENT,
			tournament.id,
			tournament.endDate,
		);

		await scheduleOrUpdateTournamentJob(
			this.tournamentQueue,
			TournamentTimeJobType.CHECK_ENOUGH_PLAYER,
			tournament.id,
			tournament.registrationClosingDate,
		);

		// await this.tournamentQueue.add(
		// 	TournamentTimeJobType.CHECK_ENOUGH_PLAYER,
		// 	{
		// 		tournamentId: tournament.id,
		// 	},
		// 	{
		// 		delay: delayTimeInMilliseconds,
		// 	},
		// );

		return new ApiResponse<Tournament>(
			HttpStatus.OK,
			"Create new tournament successfully!",
			tournament,
		);
		// return new ApiResponse<any>(
		// 	200,
		// 	"Create tournament successfully!",
		// 	await this.tournamentRepository.createTournament({
		// 		...createTournament
		// 	})
		// );
	}

	async isExistTournament(id: string): Promise<boolean> {
		const tournament = await this.tournamentRepository.getTournament(id);
		return tournament !== null;
	}

	async createTournamentWithNoTournamentSerie(
		createTournament: CreateTournament,
		user: User,
	): Promise<Tournament> {
		const tournament = await this.createTournament(createTournament, user);
		console.log(tournament);
		const tournamentEvents = await this.createTournamentEvents(
			createTournament.createTournamentEvent,
			tournament.id,
		);
		const courts = await this.createMultipleCourtForMaintaining(
			tournament.id,
			createTournament.createCourts,
		);

		return tournament;
	}

	transformTournamentEvents = (data: any, tournamentId: string): any[] => {
		const tournamentEvents: any[] = [];

		console.log(data);

		data.forEach((event: any) => {
			for (const eventType in event) {
				console.log(eventType);
				if (eventType !== "tournamentId") {
					if (Array.isArray(event[eventType])) {
						event[eventType].forEach((item: any) => {
							if (item) {
								let tournamentEventEnum: BadmintonParticipantType;
								switch (eventType) {
									case "MENS_SINGLE":
										tournamentEventEnum = BadmintonParticipantType.MENS_SINGLE;
										break;
									case "WOMENS_SINGLE":
										tournamentEventEnum =
											BadmintonParticipantType.WOMENS_SINGLE;
										break;

									case "MENS_DOUBLE":
										tournamentEventEnum = BadmintonParticipantType.MENS_DOUBLE;
										break;

									case "WOMENS_DOUBLE":
										tournamentEventEnum =
											BadmintonParticipantType.WOMENS_DOUBLE;
										break;

									case "MIXED_DOUBLE":
										tournamentEventEnum = BadmintonParticipantType.MIXED_DOUBLE;
										break;
									default:
										console.error(`Invalid eventType: ${eventType}`);
										return [];
								}

								tournamentEvents.push({
									tournamentId: tournamentId,
									tournamentEvent: eventType as BadmintonParticipantType,
									fromAge: item.fromAge,
									toAge: item.toAge,
									winningPoint: item.winningPoint,
									lastPoint: item.lastPoint,
									numberOfGames: parseInt(item.numberOfGames, 10),
									typeOfFormat: item.typeOfFormat,
									ruleOfEventExtension: item.ruleOfEventExtension,
									minimumAthlete: item.minimumAthlete,
									maximumAthlete: item.maximumAthlete,
									championshipPrize: item.championshipPrize,
									runnerUpPrize: item.runnerUpPrize,
									thirdPlacePrize: item.thirdPlacePrize,
									createPrizes: item.createPrizes
								});
							}
						});
					}
				}
			}
		});

		console.log(tournamentEvents);

		return tournamentEvents;
	};

	async createTournamentEvents(
		createTournamentEvents: CreateTournamentEventsDTO,
		tournamentId: string,
	): Promise<TournamentEvent[]> {
		const tournamentEvents: TournamentEvent[] = [];

		const transformedData = this.transformTournamentEvents(
			createTournamentEvents,
			tournamentId,
		);

		console.log("transformedData", transformedData);

		const createdTournamentEvents =
			await this.tournamentEventRepository.createMultipleTournamentEvent(
				transformedData,
				tournamentId,
			);
		return createdTournamentEvents;
	}

	async createTournament(
		createTournament: CreateTournament,
		organizer: User,
	): Promise<Tournament> {
		const tournament = await this.tournamentRepository.createTournament({
			id: createTournament.id,
			name: createTournament.name,
			shortName: createTournament.shortName,
			registrationOpeningDate: createTournament.registrationOpeningDate,
			registrationClosingDate: createTournament.registrationClosingDate,
			backgroundTournament: createTournament.backgroundTournament,
			checkInBeforeStart: createTournament.checkInBeforeStart,
			drawDate: createTournament.drawDate,
			endDate: createTournament.endDate,
			startDate: createTournament.startDate,
			registrationFeePerPerson: createTournament.registrationFeePerPerson,
			registrationFeePerPair: createTournament.registrationFeePerPair,
			maxEventPerPerson: createTournament.maxEventPerPerson,
			prizePool: createTournament.prizePool,
			mainColor: createTournament.mainColor,
			numberOfCourt: createTournament.createCourts.createCourts.length,
			protestFeePerTime: createTournament.protestFeePerTime,
			hasMerchandise: createTournament.hasMerchandise,
			merchandiseImages: createTournament.merchandiseImages,
			numberOfMerchandise: createTournament.numberOfMerchandise,
			location: createTournament.location,
			requiredAttachment: createTournament.requiredAttachment,
			tournamentSerieId: createTournament.tournamentSerieId,
			organizerId: organizer.id,
			contactEmail: createTournament.contactEmail,
			contactPhone: createTournament.contactPhone,
			description: createTournament.description,
			introduction: createTournament.introduction,
			isRecruit: createTournament.isRecruit,
			numberOfUmpires: createTournament.numberOfUmpires
		});
		return tournament;
	}

	async createMultipleCourtForMaintaining(
		tournamentId: string,
		createCourts: ICreateCourts,
	): Promise<Court[]> {
		return await this.courtRepository.createMultipleCourtsWithCourtCode(
			tournamentId,
			createCourts,
		);
	}
}
