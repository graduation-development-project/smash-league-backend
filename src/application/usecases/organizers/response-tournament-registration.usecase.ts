import {
	BadRequestException,
	HttpStatus,
	Inject,
	Injectable,
} from "@nestjs/common";
import { CreateNotificationDTO } from "../../../domain/dtos/notifications/create-notification.dto";
import { ResponseTournamentRegistrationDTO } from "../../../domain/dtos/organizers/response-tournament-registration.dto";
import { OrganizersRepositoryPort } from "../../../domain/repositories/organizers.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";
import {
	ReasonType,
	TournamentRegistrationRole,
	TournamentRegistrationStatus,
} from "@prisma/client";
import { NotificationTypeMap } from "../../../infrastructure/enums/notification-type.enum";
import { NotificationsRepositoryPort } from "../../../domain/repositories/notifications.repository.port";
import { PrismaService } from "../../../infrastructure/services/prisma.service";
import { TournamentRegistrationRepositoryPort } from "../../../domain/repositories/tournament-registration.repository.port";
import { TournamentUmpireRepositoryPort } from "../../../domain/repositories/tournament-umpire.repository.port";

@Injectable()
export class ResponseTournamentRegistrationUseCase {
	constructor(
		@Inject("NotificationRepository")
		private notificationRepository: NotificationsRepositoryPort,
		@Inject("TournamentRegistrationRepositoryPort")
		private tournamentRegistrationRepository: TournamentRegistrationRepositoryPort,
		@Inject("TournamentUmpireRepositoryPort")
		private tournamentUmpireRepository: TournamentUmpireRepositoryPort,
		private prismaService: PrismaService,
	) {}

	async execute(
		responseTournamentRegistrationDTO: ResponseTournamentRegistrationDTO,
	): Promise<ApiResponse<null>> {
		const { tournamentRegistrationId, rejectReason, option, userId } =
			responseTournamentRegistrationDTO;

		const existedRegistration =
			await this.tournamentRegistrationRepository.getTournamentRegistrationById(
				tournamentRegistrationId,
			);

		if (!existedRegistration) {
			throw new BadRequestException("Tournament Registration not found.");
		}

		if (existedRegistration.status !== TournamentRegistrationStatus.PENDING) {
			throw new BadRequestException("This registration is already response.");
		}

		const isTournamentOrganizer =
			await this.prismaService.tournament.findUnique({
				where: { id: existedRegistration.tournamentId, organizerId: userId },
			});

		if (!isTournamentOrganizer) {
			throw new BadRequestException("You are not organizer of this tournament");
		}

		try {
			// * Check if Athlete update status: ON_WAITING_REGISTRATION_FEE
			// * If Umpire update status: APPROVED
			await this.prismaService.tournamentRegistration.update({
				where: { id: tournamentRegistrationId },
				data: {
					status: option
						? existedRegistration.registrationRole ===
							TournamentRegistrationRole.ATHLETE
							? TournamentRegistrationStatus.ON_WAITING_REGISTRATION_FEE
							: TournamentRegistrationStatus.APPROVED
						: TournamentRegistrationStatus.REJECTED,
				},
			});

			if (option) {
				if (
					existedRegistration.registrationRole ===
					TournamentRegistrationRole.ATHLETE
				) {
					await this.notificationRepository.createNotification(
						{
							title: `Your tournament registration has been approved`,
							message: `Your tournament registration has been approved, please pay your registration fee`,
							type: NotificationTypeMap.Approve.id,
							tournamentRegistrationId,
						},
						[existedRegistration.userId],
					);
				} else {
					await this.tournamentUmpireRepository.createTournamentUmpire(
						existedRegistration.tournamentId,
						existedRegistration.userId,
					);

					await this.notificationRepository.createNotification(
						{
							title: `Your tournament registration has been approved`,
							message: `Your tournament registration has been approved`,
							type: NotificationTypeMap.Approve.id,
							tournamentRegistrationId,
						},
						[existedRegistration.userId],
					);
				}
			}

			if (!option) {
				await this.prismaService.reason.create({
					data: {
						type: ReasonType.TOURNAMENT_REGISTRATION_REJECTION,
						tournamentRegistrationId,
						reason: rejectReason || "No reason provided",
					},
				});

				await this.notificationRepository.createNotification(
					{
						title: `Organizer rejected your tournament registration`,
						message: rejectReason || "Your registration was rejected",
						type: NotificationTypeMap.Reject.id,
						tournamentRegistrationId,
					},
					[existedRegistration.userId],
				);
			}

			return new ApiResponse<null>(
				HttpStatus.NO_CONTENT,
				option
					? "Accepted tournament registration successfully"
					: "Rejected tournament registration successfully",
				null,
			);
		} catch (error) {
			console.error(
				`Failed to ${option ? "approve" : "reject"} tournament registration:`,
				error,
			);
			throw error;
		}
	}
}
