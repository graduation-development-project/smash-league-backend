import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { PrismaService } from "../../services/prisma.service";
import { TournamentEvent, TournamentEventStatus } from "@prisma/client";
import { getRegistrationFee } from "../../util/get-registration-fee.util";
import { NotificationsRepositoryPort } from "../../../domain/repositories/notifications.repository.port";
import { CreateNotificationDTO } from "../../../domain/dtos/notifications/create-notification.dto";
import { NotificationTypeMap } from "../../enums/notification-type.enum";
import { Inject } from "@nestjs/common";

@Processor("checkEnoughPlayerQueue", { concurrency: 3 })
export class CheckEnoughPlayerQueueProcessor extends WorkerHost {
	constructor(
		private readonly prisma: PrismaService,
		@Inject("NotificationRepository")
		private notificationRepository: NotificationsRepositoryPort,
	) {
		super();
	}

	async process(job: Job): Promise<void> {
		const { tournamentId } = job.data;

		console.log("run checkEnoughPlayerQueue");

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
					await this.prisma.paybackFeeList.createMany({
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
	}
}
