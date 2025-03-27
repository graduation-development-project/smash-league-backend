import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { OrganizersRepositoryPort } from "../../domain/repositories/organizers.repository.port";
import { ResponseTournamentRegistrationDTO } from "../../domain/dtos/organizers/response-tournament-registration.dto";
import { PrismaService } from "../services/prisma.service";
import {
	Match,
	MatchStatus,
	ReasonType,
	TournamentRegistrationStatus,
} from "@prisma/client";
import { NotificationTypeMap } from "../enums/notification-type.enum";
import { NotificationsRepositoryPort } from "../../domain/repositories/notifications.repository.port";
import {
	ITournamentParticipantsResponse,
	ITournamentRegistrationResponse,
} from "../../domain/interfaces/tournament/tournament.interface";
import { AssignUmpireDTO } from "../../domain/dtos/organizers/assign-umpire.dto";

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

			if (option) {
				await this.prismaService.tournamentParticipants.create({
					data: {
						tournamentId: existedRegistration.tournamentId,
						userId: existedRegistration.userId,
						tournamentEventId: existedRegistration.tournamentEventId,
						partnerId: existedRegistration.partnerId || null,
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

	async getTournamentRegistrationByTournamentId(
		tournamentId: string,
		organizerId: string,
	): Promise<ITournamentRegistrationResponse[]> {
		try {
			const isTournamentOrganizer =
				await this.prismaService.tournament.findUnique({
					where: {
						id: tournamentId,
						organizerId,
					},
				});

			if (!isTournamentOrganizer) {
				throw new BadRequestException(
					"You are not organizer of this tournament",
				);
			}

			const tournamentRegistrations =
				await this.prismaService.tournamentRegistration.findMany({
					where: {
						tournamentId,
					},

					include: {
						tournamentEvent: true,
					},
				});

			const groupedData = tournamentRegistrations.reduce(
				(acc, registration) => {
					const tournamentEventId = registration.tournamentEventId;

					if (!acc[tournamentEventId]) {
						acc[tournamentEventId] = {
							tournamentEvent: registration.tournamentEvent,
							registrations: [],
						};
					}
					delete registration.tournamentEvent;
					acc[tournamentEventId].registrations.push(registration);

					return acc;
				},
				{},
			);

			// Convert object to array
			return Object.values(groupedData);
		} catch (e) {
			console.error("Get Tournament Registration Error", e);
			throw e;
		}
	}

	async getTournamentParticipantsByTournamentId(
		tournamentId: string,
		organizerId: string,
	): Promise<ITournamentParticipantsResponse[]> {
		try {
			const isTournamentOrganizer =
				await this.prismaService.tournament.findUnique({
					where: {
						id: tournamentId,
						organizerId,
					},
				});

			if (!isTournamentOrganizer) {
				throw new BadRequestException(
					"You are not organizer of this tournament",
				);
			}

			const tournamentParticipants =
				await this.prismaService.tournamentParticipants.findMany({
					where: {
						tournamentId,
					},

					include: {
						tournamentEvent: true,
					},
				});

			console.log(tournamentParticipants);

			const groupedData = tournamentParticipants.reduce((acc, participant) => {
				const tournamentEventId = participant.tournamentEventId;

				if (!acc[tournamentEventId]) {
					acc[tournamentEventId] = {
						tournamentEvent: participant.tournamentEvent,
						participants: [],
					};
				}
				delete participant.tournamentEvent;
				acc[tournamentEventId].participants.push(participant);

				return acc;
			}, {});

			// Convert object to array
			return Object.values(groupedData);
		} catch (e) {
			console.error("Get Tournament Registration Error", e);
			throw e;
		}
	}

	async assignUmpireForMatch(assignUmpireDTO: AssignUmpireDTO): Promise<Match> {
		const { umpireId, matchId, tournamentId } = assignUmpireDTO;
		try {
			const isUmpireInMatch: Match[] = await this.prismaService.match.findMany({
				where: {
					umpireId,
					tournamentEvent: {
						tournamentId,
					},
					matchStatus: {
						not: MatchStatus.ENDED,
					},
				},
			});

			if (isUmpireInMatch.length > 0) {
				throw new BadRequestException("Umpire have match not end");
			}

			return await this.prismaService.match.update({
				where: {
					id: matchId,
				},
				data: {
					umpireId,
				},
			});
		} catch (e) {
			console.error("Assign umpire failed", e);
			throw e;
		}
	}
}
