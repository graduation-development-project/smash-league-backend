import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TournamentParticipantsRepositoryPort } from "../../../domain/repositories/tournament-participant.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { NotificationsRepositoryPort } from "../../../domain/repositories/notifications.repository.port";
import { CreateNotificationDTO } from "../../../domain/dtos/notifications/create-notification.dto";

@Injectable()
export class BanUserUseCase {
	constructor(
		@Inject("TournamentParticipantRepositoryPort")
		private tournamentParticipantsRepository: TournamentParticipantsRepositoryPort,
		@Inject("NotificationRepository")
		private notificationRepository: NotificationsRepositoryPort,
	) {}

	async execute(
		participantId: string,
		tournamentId: string,
		reason: string,
	): Promise<ApiResponse<void>> {
		const notificationData: CreateNotificationDTO = {
			title: "You was banned from this tournament",
			message: reason,
		};
		await this.notificationRepository.createNotification(notificationData, [
			participantId,
		]);

		return new ApiResponse<void>(
			HttpStatus.NO_CONTENT,
			"Ban User Successfully",
			await this.tournamentParticipantsRepository.banParticipant(
				participantId,
				tournamentId,
			),
		);
	}
}
