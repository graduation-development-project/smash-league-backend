import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { OrganizersRepositoryPort } from "../../domain/repositories/organizers.repository.port";
import { ResponseTournamentRegistrationDTO } from "../../domain/dtos/organizers/response-tournament-registration.dto";
import { PrismaService } from "../services/prisma.service";
import {
	Match,
	MatchStatus,
	ReasonType,
	TournamentRegistration,
	TournamentRegistrationRole,
	TournamentRegistrationStatus,
	Transaction,
	User,
} from "@prisma/client";
import { NotificationTypeMap } from "../enums/notification-type.enum";
import { NotificationsRepositoryPort } from "../../domain/repositories/notifications.repository.port";
import {
	ITournamentDetailResponse,
	ITournamentParticipantsResponse,
} from "../../domain/interfaces/tournament/tournament.interface";
import { AssignUmpireDTO } from "../../domain/dtos/organizers/assign-umpire.dto";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { formatDate, getCurrentTime } from "../util/format-date-time.util";
import { RoleMap } from "../enums/role.enum";
import { TransactionRepositoryPort } from "../../domain/repositories/transaction.repository.port";
import { CreateNotificationDTO } from "../../domain/dtos/notifications/create-notification.dto";
import { TournamentRegistrationRepositoryPort } from "../../domain/repositories/tournament-registration.repository.port";

@Injectable()
export class PrismaOrganizersRepositoryAdapter
	implements OrganizersRepositoryPort
{
	constructor(
		private prismaService: PrismaService,
		@InjectQueue("emailQueue") private emailQueue: Queue,
		@Inject("NotificationRepository")
		private notificationsRepository: NotificationsRepositoryPort,
		@Inject("TransactionRepository")
		private transactionRepository: TransactionRepositoryPort,
		@Inject("TournamentRegistrationRepositoryPort")
		private readonly tournamentRegistrationRepository: TournamentRegistrationRepositoryPort,
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
					isDeleted: false,
				},

				include: {
					tournamentEvent: true,
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
				console.log(
					existedRegistration.registrationRole ===
						TournamentRegistrationRole.ATHLETE,
				);

				if (
					existedRegistration.registrationRole ===
					TournamentRegistrationRole.ATHLETE
				) {
					// await this.prismaService.tournamentParticipants.create({
					// 	data: {
					// 		tournamentId: existedRegistration.tournamentId,
					// 		userId: existedRegistration.userId,
					// 		tournamentEventId: existedRegistration.tournamentEventId,
					// 		partnerId: existedRegistration.partnerId || null,
					// 	},
					// });

					await this.notificationsRepository.createNotification(
						{
							title: `Your tournament registration has been approved`,
							message: `Your tournament registration has been approved, please pay your registration fee`,
							type: NotificationTypeMap.Approve.id,
							tournamentRegistrationId,
						},
						[existedRegistration.userId],
					);
				} else {
					await this.prismaService.tournamentUmpires.create({
						data: {
							tournamentId: existedRegistration.tournamentId,
							userId: existedRegistration.userId,
						},
					});

					await this.notificationsRepository.createNotification(
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
		tournamentEventId: string,
		organizerId: string,
	): Promise<TournamentRegistration[]> {
		try {
			const isTournamentOrganizer =
				await this.prismaService.tournamentEvent.findUnique({
					where: {
						id: tournamentEventId,
					},

					select: {
						tournament: {
							select: {
								organizerId: true,
							},
						},
					},
				});

			if (isTournamentOrganizer?.tournament?.organizerId !== organizerId) {
				throw new BadRequestException(
					"You are not organizer of this tournament",
				);
			}

			return await this.prismaService.tournamentRegistration.findMany({
				where: {
					tournamentEventId,
					isDeleted: false,
				},

				include: {
					user: {
						select: {
							id: true,
							name: true,
							avatarURL: true,
							gender: true,
							phoneNumber: true,
							height: true,
							email: true,
							dateOfBirth: true,
						},
					},

					partner: {
						select: {
							id: true,
							name: true,
							avatarURL: true,
							gender: true,
							phoneNumber: true,
							height: true,
							email: true,
							dateOfBirth: true,
						},
					},
				},
			});
		} catch (e) {
			console.error("Get Tournament Registration Error", e);
			throw e;
		}
	}

	async getUmpireRegistrationByTournamentId(
		tournamentId: string,
		organizerId: string,
	): Promise<TournamentRegistration[]> {
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

			return await this.prismaService.tournamentRegistration.findMany({
				where: {
					tournamentId,
					registrationRole: TournamentRegistrationRole.UMPIRE,
					isDeleted: false,
				},

				include: {
					user: {
						select: {
							id: true,
							name: true,
							avatarURL: true,
							gender: true,
							phoneNumber: true,
							height: true,
							email: true,
							dateOfBirth: true,
						},
					},

					partner: {
						select: {
							id: true,
							name: true,
							avatarURL: true,
							gender: true,
							phoneNumber: true,
							height: true,
							email: true,
							dateOfBirth: true,
						},
					},
				},
			});
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

			const matchDetail: Match = await this.prismaService.match.findUnique({
				where: {
					id: matchId,
				},
			});

			if (!matchDetail) {
				throw new BadRequestException("Match not found.");
			}

			const createNotificationDTO = {
				title: `You were assigned to new match`,
				message: `You were assigned to new match at ${formatDate(matchDetail.startedWhen)}, ${getCurrentTime(matchDetail.startedWhen)}`,
				type: NotificationTypeMap.Kick.id,
			};

			await this.notificationsRepository.createNotification(
				createNotificationDTO,
				[umpireId],
			);

			return await this.prismaService.$transaction(
				async (prisma): Promise<Match> => {
					const match = await prisma.match.update({
						where: {
							id: matchId,
						},
						data: {
							umpireId,
						},
					});

					await prisma.tournamentUmpires.update({
						where: {
							userId_tournamentId: {
								userId: umpireId,
								tournamentId,
							},
						},
						data: {
							isAvailable: false,
						},
					});

					return match;
				},
			);
		} catch (e) {
			console.error("Assign umpire failed", e);
			throw e;
		}
	}

	async getOwnedTournament(
		organizerId: string,
	): Promise<ITournamentDetailResponse[]> {
		try {
			const tournaments = await this.prismaService.tournament.findMany({
				where: {
					organizerId,
				},
				select: {
					id: true,
					name: true,
					shortName: true,
					mainColor: true,
					description: true,
					introduction: true,
					backgroundTournament: true,
					checkInBeforeStart: true,
					registrationOpeningDate: true,
					registrationClosingDate: true,
					drawDate: true,
					startDate: true,
					endDate: true,
					isRecruit: true,
					organizer: {
						select: {
							id: true,
							name: true,
							avatarURL: true,
							phoneNumber: true,
							email: true,
						},
					},
					contactEmail: true,
					contactPhone: true,
					hasMerchandise: true,
					hasLiveStream: true,
					location: true,
					registrationFeePerPerson: true,
					registrationFeePerPair: true,
					maxEventPerPerson: true,
					prizePool: true,
					requiredAttachment: true,
					protestFeePerTime: true,
					tournamentSerie: {
						select: {
							id: true,
							tournamentSerieName: true,
							serieBackgroundImageURL: true,
						},
					},
					tournamentEvents: {
						select: {
							tournamentEvent: true,
							fromAge: true,
							toAge: true,
							id: true,
						},
					},
					tournamentPosts: true,
				},
			});

			const tournamentResponses: ITournamentDetailResponse[] = tournaments.map(
				(tournament) => {
					const groupedEvents: {
						[tournamentEventName: string]: {
							fromAge: number;
							toAge: number;
							id: string;
						}[];
					} = tournament.tournamentEvents.reduce((acc, event) => {
						const { tournamentEvent, ...rest } = event;
						if (!acc[tournamentEvent]) {
							acc[tournamentEvent] = [];
						}
						acc[tournamentEvent].push(rest);
						return acc;
					}, {});

					return {
						...tournament,
						hasPost: tournament.tournamentPosts.length > 0,
						liveStreamRooms: [],
						tournamentEvents: groupedEvents,
						expiredTimeLeft: "",
						isRecruit: tournament.isRecruit,
					};
				},
			);

			return tournamentResponses;
		} catch (e) {
			console.error("Get owned tournament failed", e);
			throw e;
		}
	}
}
