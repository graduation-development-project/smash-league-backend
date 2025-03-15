import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { OrganizersRepositoryPort } from "../../domain/repositories/organizers.repository.port";
import { ResponseTournamentRegistrationDTO } from "../../domain/dtos/organizers/response-tournament-registration.dto";
import { PrismaService } from "../services/prisma.service";
import { ReasonType, TournamentRegistrationStatus } from "@prisma/client";
import { NotificationTypeMap } from "../enums/notification-type.enum";
import { NotificationsRepositoryPort } from "../../domain/repositories/notifications.repository.port";

@Injectable()
export class PrismaOrganizersRepositoryAdapter
	implements OrganizersRepositoryPort
{
	constructor(
		private prismaService: PrismaService,
		@Inject("NotificationRepository")
		private notificationsRepository: NotificationsRepositoryPort,
	) {}

	async responseTournamentRegistration(
		responseTournamentRegistrationDTO: ResponseTournamentRegistrationDTO,
	): Promise<string> {
		const { tournamentRegistrationId, rejectReason, option, userId } =
			responseTournamentRegistrationDTO;

		const existedRegistration =
			await this.prismaService.tournamentRegistration.findUnique({
				where: {
					id: tournamentRegistrationId,
				},
			});

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
			await this.prismaService.tournamentRegistration.update({
				where: { id: tournamentRegistrationId },
				data: {
					status: option
						? TournamentRegistrationStatus.APPROVED
						: TournamentRegistrationStatus.REJECTED,
				},
			});

			if (!option) {
				await this.prismaService.reason.create({
					data: {
						type: ReasonType.TOURNAMENT_REGISTRATION_REJECTION,
						tournamentRegistrationId,
						reason: rejectReason || "No reason provided",
					},
				});

				await this.notificationsRepository.createNotification(
					{
						title: `Organizer rejected your tournament registration`,
						message: rejectReason || "Your registration was rejected",
						type: NotificationTypeMap.Reject.id,
						tournamentRegistrationId,
					},
					[existedRegistration.userId],
				);
			}

			return option
				? "Accepted tournament registration successfully"
				: "Rejected tournament registration successfully";
		} catch (error) {
			console.error(
				`Failed to ${option ? "approve" : "reject"} tournament registration:`,
				error,
			);
			throw error;
		}
	}
}
