import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { PrismaService } from "../../services/prisma.service";
import {
	TournamentEvent,
	TournamentEventStatus,
	TournamentStatus,
} from "@prisma/client";
import { getRegistrationFee } from "../../util/get-registration-fee.util";
import { NotificationsRepositoryPort } from "../../../domain/repositories/notifications.repository.port";
import { CreateNotificationDTO } from "../../../domain/dtos/notifications/create-notification.dto";
import { NotificationTypeMap } from "../../enums/notification-type.enum";
import { Inject } from "@nestjs/common";
import { TournamentRepositoryPort } from "../../../domain/repositories/tournament.repository.port";
import { TournamentTimeJobType } from "../../enums/tournament-time-job.enum";

@Processor("tournamentQueue")
export class TournamentQueueProcessor extends WorkerHost {
	constructor(
		private readonly prisma: PrismaService,
		@Inject("NotificationRepository")
		private notificationRepository: NotificationsRepositoryPort,
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
	) {
		super();
	}

	async process(job: Job): Promise<void> {
		const { name: jobType, data } = job;
		const { tournamentId } = data;

		switch (jobType) {
			case TournamentTimeJobType.CHECK_ENOUGH_PLAYER:
				const tournament = await this.prisma.tournament.findUnique({
					where: { id: tournamentId },
					include: {
						tournamentEvents: {
							include: {
								tournamentParticipants: true,
								tournament: true,
							},
						},
					},
				});

				for (const event of tournament.tournamentEvents) {
					if (event.tournamentParticipants.length < event.minimumAthlete) {
						await this.prisma.tournamentEvent.update({
							where: { id: event.id },
							data: { tournamentEventStatus: TournamentEventStatus.CANCELED },
						});

						const paybackRecords = event.tournamentParticipants.map(
							(participant) => ({
								userId: participant.userId,
								tournamentId: tournament.id,
								tournamentEventId: event.id,
								value: getRegistrationFee(event),
								isPaid: false,
							}),
						);

						if (paybackRecords.length > 0) {
							await this.prisma.paybackFee.createMany({
								data: paybackRecords,
								skipDuplicates: true,
							});

							const notificationData: CreateNotificationDTO = {
								title: "The event you participate in is canceled",
								message: `The event  ${event.tournamentEvent} from tournament ${tournament.name} has been canceled. You registration fee will be refunded soon`,
							};
							await this.notificationRepository.createNotification(
								notificationData,
								paybackRecords.map((user) => user.userId),
							);
						}

						console.log("end checkEnoughPlayerQueue");
					}
				}
				console.log(
					`🏸 Checking player count for tournament ${tournamentId}...`,
				);
				break;

			//* OPEN REGISTRATION
			case TournamentTimeJobType.OPEN_REGISTRATION:
				console.log(`🎯 OPEN REGISTRATION ${tournamentId}...`);
				await this.tournamentRepository.updateTournamentStatus(
					tournamentId,
					TournamentStatus.OPENING_FOR_REGISTRATION,
				);
				break;

			//* CLOSING REGISTRATION
			case TournamentTimeJobType.CLOSE_REGISTRATION:
				console.log(`🎯 CLOSING REGISTRATION ${tournamentId}...`);
				await this.tournamentRepository.updateTournamentStatus(
					tournamentId,
					TournamentStatus.CLOSING_FOR_REGISTRATION,
				);
				break;

			//* DRAW DATE
			case TournamentTimeJobType.DRAW_DATE:
				console.log(`🎯 DRAW DATE ${tournamentId}...`);
				await this.tournamentRepository.updateTournamentStatus(
					tournamentId,
					TournamentStatus.DRAWING,
				);
				break;

			//* START TOURNAMENT
			case TournamentTimeJobType.START_TOURNAMENT:
				console.log(`🎯 Starting tournament ${tournamentId}...`);
				await this.tournamentRepository.updateTournamentStatus(
					tournamentId,
					TournamentStatus.ON_GOING,
				);
				break;

			//* END TOURNAMENT
			case TournamentTimeJobType.END_TOURNAMENT:
				console.log(`🏁 Ending tournament ${tournamentId}...`);
				await this.tournamentRepository.updateTournamentStatus(
					tournamentId,
					TournamentStatus.FINISHED,
				);
				break;

			default:
				console.warn(`⚠️ Unknown job type: ${jobType}`);
		}
	}
}
