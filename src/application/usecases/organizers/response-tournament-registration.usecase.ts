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
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

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
		@InjectQueue("emailQueue") private emailQueue: Queue,
	) {}

	async execute(
		responseTournamentRegistrationDTO: ResponseTournamentRegistrationDTO,
	): Promise<ApiResponse<null>> {
		const { tournamentRegistrationId, rejectReason, option, userId } =
			responseTournamentRegistrationDTO;

		const existedRegistration: any =
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
					const tournament = await this.prismaService.tournament.findUnique({
						where: {
							id: existedRegistration.tournamentId,
						},
					});

					const tournamentUmpires =
						await this.prismaService.tournamentUmpires.findMany({
							where: {
								tournamentId: existedRegistration.tournamentId,
							},
						});

					const isFull =
						tournament.numberOfUmpires - 1 === tournamentUmpires.length;

					if (isFull) {
						const registrationList =
							await this.prismaService.tournamentRegistration.findMany({
								where: {
									tournamentId: existedRegistration.tournamentId,
									registrationRole: TournamentRegistrationRole.UMPIRE,
									status: TournamentRegistrationStatus.PENDING,
								},
							});

						console.log(registrationList);

						const filteredIds = registrationList
							.filter((item) => {
								return item.id !== existedRegistration.id;
							})
							.map((item) => item.id);

						const filteredUserIds = registrationList
							.filter((item) => {
								return item.id !== existedRegistration.id;
							})
							.map((item) => item.userId);

						console.log("filteredIds", filteredIds);

						await this.tournamentRegistrationRepository.cancelManyTournamentRegistration(
							filteredIds,
						);

						const notification: CreateNotificationDTO = {
							message: `Your registration for tournament ${tournament.name} has been cancelled because the tournament is full umpires`,
							title: "Your registration is cancelled",
						};

						await this.notificationRepository.createNotification(
							notification,
							filteredUserIds,
						);
					}

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

				await this.emailQueue.add("sendEmail", {
					to: existedRegistration.user.email,
					subject: "Tournament Registration Response",
					template: "tournament-registration-response.hbs",
					context: {
						username: existedRegistration.user.name,
						isAccepted: true,
						isUmpire:
							existedRegistration.registrationRole ===
							TournamentRegistrationRole.UMPIRE,
						tournamentName: isTournamentOrganizer.name,
						tournamentEvent:
							existedRegistration?.tournamentEvent?.tournamentEvent ?? null,
					},
				});
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

				await this.emailQueue.add("sendEmail", {
					to: existedRegistration.user.email,
					subject: "Tournament Registration Response",
					template: "tournament-registration-response.hbs",
					context: {
						username: existedRegistration.user.name,
						isAccepted: false,
						isUmpire:
							existedRegistration.registrationRole ===
							TournamentRegistrationRole.UMPIRE,
						tournamentName: isTournamentOrganizer.name,
						tournamentEvent:
							existedRegistration.tournamentEvent.tournamentEvent,
					},
				});
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
