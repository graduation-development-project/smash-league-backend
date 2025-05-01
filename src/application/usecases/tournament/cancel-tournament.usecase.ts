import { ApiResponse } from "../../../domain/dtos/api-response";
import { BadRequestException, HttpStatus, Inject } from "@nestjs/common";
import { TournamentRepositoryPort } from "../../../domain/repositories/tournament.repository.port";
import { getRegistrationFee } from "../../../infrastructure/util/get-registration-fee.util";
import { PaybackFeeRepositoryPort } from "../../../domain/repositories/payback-fee-list.repository.port";
import { PrismaService } from "../../../infrastructure/services/prisma.service";
import { NotificationsRepositoryPort } from "../../../domain/repositories/notifications.repository.port";
import { CreateNotificationDTO } from "../../../domain/dtos/notifications/create-notification.dto";

export class CancelTournamentUseCase {
	constructor(
		private prismaService: PrismaService,
		@Inject("TournamentRepository")
		private tournamentRepository: TournamentRepositoryPort,
		@Inject("PaybackFeeRepositoryPort")
		private paybackFeeRepository: PaybackFeeRepositoryPort,
		@Inject("NotificationRepository")
		private notificationRepository: NotificationsRepositoryPort,
	) {}

	async execute(tournamentId: string): Promise<ApiResponse<null>> {
		const tournament =
			await this.tournamentRepository.getTournament(tournamentId);

		if (!tournament) {
			throw new BadRequestException("Tournament not found");
		}

		const updatedTournament =
			await this.tournamentRepository.cancelTournament(tournamentId);

		const tournamentEvents = await this.prismaService.tournamentEvent.findMany({
			where: {
				tournamentId,
			},

			include: {
				tournamentParticipants: true,
				tournament: true,
			},
		});

		for (const event of tournamentEvents) {
			console.log(event);
			const paybackRecords = event.tournamentParticipants.map(
				(participant) => ({
					userId: participant.userId,
					tournamentId: tournament.id,
					tournamentEventId: event.id,
					value: getRegistrationFee(event),
				}),
			);

			if (paybackRecords.length > 0) {
				await this.paybackFeeRepository.createManyPaybackFee(
					paybackRecords,
				);

				const notificationData: CreateNotificationDTO = {
					title: "The event you participate in is canceled",
					message: `The event  ${event.tournamentEvent} from tournament ${tournament.name} has been canceled. You registration fee will be refunded soon`,
				};
				await this.notificationRepository.createNotification(
					notificationData,
					paybackRecords.map((user) => user.userId),
				);
			}
		}

		return new ApiResponse(
			HttpStatus.NO_CONTENT,
			"Cancel Tournament Successfully",
			null,
		);
	}
}
