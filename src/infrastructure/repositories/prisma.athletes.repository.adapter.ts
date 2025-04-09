import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import {
	InvitationStatus,
	ReasonType,
	Team,
	TeamInvitation,
	TeamRequest,
	TeamRequestStatus,
	TeamRequestType,
	Tournament,
	TournamentRegistration,
	TournamentRegistrationRole,
	TournamentRegistrationStatus,
	User,
	UserRole,
	UserTeam,
	UserVerification,
} from "@prisma/client";
import { AthletesRepositoryPort } from "../../domain/repositories/athletes.repository.port";
import { RegisterTournamentDTO } from "../../domain/dtos/athletes/register-tournament.dto";
import { RegisterNewRoleDTO } from "../../domain/dtos/athletes/register-new-role.dto";
import { PrismaService } from "../services/prisma.service";
import { TournamentStatusEnum } from "../enums/tournament-status.enum";
import { UploadService } from "../services/upload.service";
import { ResponseToTeamInvitationDTO } from "../../domain/dtos/athletes/response-to-team-invitation.dto";
import { NotificationTypeMap } from "../enums/notification-type.enum";
import { LeaveTeamDTO } from "../../domain/dtos/athletes/leave-team.dto";
import { NotificationsRepositoryPort } from "../../domain/repositories/notifications.repository.port";
import { RequestJoinTeamDTO } from "../../domain/dtos/athletes/request-join-team.dto";
import { CreateNotificationDTO } from "../../domain/dtos/notifications/create-notification.dto";
import { ResponseTeamLeaderTransferDTO } from "../../domain/dtos/athletes/response-team-leader-transfer.dto";
import {
	IPaginatedOutput,
	IPaginateOptions,
} from "../../domain/interfaces/interfaces";
import {
	DEFAULT_PAGE_NUMBER,
	DEFAULT_PAGE_SIZE,
} from "../constant/pagination.constant";
import { IParticipatedTournamentResponse } from "../../domain/interfaces/tournament/tournament.interface";
import { TournamentStatus } from "../enums/tournament/tournament-status.enum";
import { calculateAgeUtil } from "../util/calculate-age.util";
import { RoleMap } from "../enums/role.enum";

@Injectable()
export class PrismaAthletesRepositoryAdapter implements AthletesRepositoryPort {
	constructor(
		private prisma: PrismaService,
		private uploadService: UploadService,
		@Inject("NotificationRepository")
		private notificationsRepository: NotificationsRepositoryPort,
	) {}

	// async registerTournament(registerTournamentDTO: RegisterTournamentDTO): Promise<TournamentRegistration> {
	// 	return await this.prisma.tournamentRegistration.create({
	// 		data: {
	// 			tournamentId: "abc",
	// 			tournamentEventId: "e34478ab-92fa-4c7a-996e-52d6adae406a",
	// 			registrationRole: "ATHLETE",
	// 			userId: "1002ee23-744f-43ac-9462-6f6bf7368fd6"
	// 		}
	// 	});
	// }

	async registerTournament(
		registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentRegistration> {
		const {
			tournamentId,
			partnerEmail,
			user,
			tournamentEventId,
			registrationRole,
			fromTeamId,
			files,
		} = registerTournamentDTO;

		let registrationDocumentPartner: string[] = [];
		let registrationDocumentCreator: string[] = [];

		try {
			const tournament = await this.prisma.tournament.findUnique({
				where: { id: tournamentId },
			});
			if (!tournament) throw new BadRequestException("Tournament not found");

			if (tournament.organizerId === user.id) {
				throw new BadRequestException(
					"You cannot participate in your own tournament",
				);
			}

			if (tournament.status !== TournamentStatus.OPENING_FOR_REGISTRATION) {
				throw new BadRequestException(
					"This tournament is not open for registration",
				);
			}

			let isDoubleEvent = false;
			let event: any = null;
			if (registrationRole !== TournamentRegistrationRole.UMPIRE) {
				event = await this.prisma.tournamentEvent.findUnique({
					where: { id: tournamentEventId },
				});
				if (!event) throw new BadRequestException("Tournament event not found");
				isDoubleEvent = event.tournamentEvent.toUpperCase().includes("DOUBLE");
			}

			const whereClause =
				registrationRole === TournamentRegistrationRole.UMPIRE
					? { tournamentId }
					: {
							tournamentId,
							OR: [
								{ userId: user.id, tournamentEventId },
								{ partnerId: user.id, tournamentEventId },
							],
						};

			const userRegistered = await this.prisma.tournamentRegistration.findFirst(
				{
					where: whereClause,
				},
			);
			if (userRegistered)
				throw new BadRequestException(
					"You are already registered for this tournament",
				);

			if (fromTeamId) {
				const teamExisted = await this.prisma.team.findUnique({
					where: { id: fromTeamId },
				});
				if (!teamExisted)
					throw new BadRequestException("Your team does not exist");
			}

			if (registrationRole !== TournamentRegistrationRole.UMPIRE) {
				const userAge = calculateAgeUtil(user.dateOfBirth);
				if (
					!userAge ||
					(event && (userAge < event.fromAge || userAge > event.toAge))
				) {
					throw new BadRequestException(
						"Your age is not suitable for this event",
					);
				}
			}

			const folderName = `tournament-registration/${tournamentId}/${tournamentEventId || "umpire"}/${user.id}`;
			const imageUrls = await this.uploadService.uploadFiles(
				files,
				folderName,
				user.id,
			);

			registrationDocumentCreator = imageUrls
				.slice(0, 3)
				.map((file) => file.secure_url);
			if (registrationDocumentCreator.length < 3) {
				throw new BadRequestException("You must submit verification documents");
			}

			let partnerId: string | null = null;
			if (isDoubleEvent) {
				if (!partnerEmail)
					throw new BadRequestException(
						"Partner is required for double matches",
					);
				const partner = await this.prisma.user.findUnique({
					where: { email: partnerEmail },
				});
				if (!partner) throw new BadRequestException("Partner does not exist");

				partnerId = partner.id;
				const partnerRegistered =
					await this.prisma.tournamentRegistration.findFirst({
						where: {
							tournamentId,
							OR: [
								{ userId: partner.id, tournamentEventId },
								{ partnerId: partner.id, tournamentEventId },
							],
						},
					});
				if (partnerRegistered)
					throw new BadRequestException("Your partner is already registered");

				registrationDocumentPartner = imageUrls
					.slice(3, 6)
					.map((file) => file.secure_url);
				if (registrationDocumentPartner.length < 3) {
					throw new BadRequestException(
						"Your partner must submit verification documents",
					);
				}
			}

			return this.prisma.tournamentRegistration.create({
				data: {
					tournamentId,
					userId: user.id,
					tournamentEventId:
						registrationRole === TournamentRegistrationRole.UMPIRE
							? null
							: tournamentEventId,
					partnerId:
						registrationRole === TournamentRegistrationRole.UMPIRE
							? null
							: partnerId,
					registrationDocumentCreator,
					registrationDocumentPartner,
					registrationRole:
						registrationRole.toUpperCase() as TournamentRegistrationRole,
					fromTeamId: fromTeamId || null,
				},
			});
		} catch (e) {
			throw e;
		}
	}

	async getParticipatedTournaments(
		options: IPaginateOptions,
		userID: string,
		tournamentStatus: string,
	): Promise<IPaginatedOutput<IParticipatedTournamentResponse>> {
		try {
			const page: number =
				parseInt(options.page?.toString()) || DEFAULT_PAGE_NUMBER;
			const perPage: number =
				parseInt(options.perPage?.toString()) || DEFAULT_PAGE_SIZE;
			const skip: number = (page - 1) * perPage;

			const tournaments = await this.prisma.tournamentRegistration.findMany({
				where: {
					userId: userID,
					status: TournamentRegistrationStatus.PENDING,
				},

				include: {
					tournament: true,
				},
			});

			const groupedData = tournaments.reduce((acc, registration) => {
				const tournamentId = registration.tournament.id;

				if (!acc[tournamentId]) {
					acc[tournamentId] = {
						tournament: registration.tournament,
						registrations: [],
					};
				}
				delete registration.tournament;
				acc[tournamentId].registrations.push(registration);

				return acc;
			}, {});

			// Convert object to array
			const result: IParticipatedTournamentResponse[] =
				Object.values(groupedData);

			const lastPage: number = Math.ceil(result.length / perPage);
			const nextPage: number = page < lastPage ? page + 1 : null;
			const prevPage: number = page > 1 ? page - 1 : null;

			return {
				data: result,
				meta: {
					total: result.length,
					lastPage,
					currentPage: page,
					totalPerPage: perPage,
					prevPage,
					nextPage,
				},
			};
		} catch (e) {
			throw e;
		}
	}

	// async uploadVerificationImage(
	// 	files: Express.Multer.File[],
	// 	userID: string,
	// ): Promise<TCloudinaryResponse[]> {
	// 	try {
	// 		const now = new Date();
	// 		const folderName = `verification-information/${now.toISOString().split("T")[0]}/${userID}`;
	//
	// 		const uploadPromises: Promise<TCloudinaryResponse>[] = files.map(
	// 			(file) => {
	// 				return new Promise<TCloudinaryResponse>((resolve, reject) => {
	// 					const uploadStream = cloudinary.uploader.upload_stream(
	// 						{
	// 							resource_type: "auto",
	// 							folder: folderName, //* Specify the folder name
	// 							public_id: `${userID}-${now.toISOString()}`, //* Unique file name
	// 						},
	//
	// 						(error, result) => {
	// 							if (error) return reject(error);
	// 							resolve(result);
	// 						},
	// 					);
	//
	// 					streamifier.createReadStream(file.buffer).pipe(uploadStream);
	// 				});
	// 			},
	// 		);
	//
	// 		return Promise.all(uploadPromises);
	// 	} catch (e) {
	// 		throw e;
	// 	}
	// }

	async registerNewRole(
		registerNewRoleDTO: RegisterNewRoleDTO,
	): Promise<UserVerification> {
		try {
			console.log(registerNewRoleDTO);
			const { files, role, userId } = registerNewRoleDTO;

			const roleId: string = RoleMap[role].id;

			console.log(roleId);

			const roleExisted: UserRole = await this.prisma.userRole.findUnique({
				where: {
					userId_roleId: {
						userId,
						roleId,
					},
				},
			});

			if (roleExisted) {
				throw new BadRequestException("This role is already registered");
			}

			const verificationExisted = await this.prisma.userVerification.findFirst({
				where: {
					userId,
					role: roleId,
				},
			});

			if (verificationExisted) {
				throw new BadRequestException("You already registered this role");
			}

			const folderName = `verification-information/${new Date().toISOString().split("T")[0]}/${userId}`;

			const imageUrls = await this.uploadService.uploadFiles(
				files,
				folderName,
				userId,
			);

			console.log(imageUrls);

			if (!imageUrls) {
				throw new BadRequestException("Upload images fail");
			}

			return this.prisma.userVerification.create({
				data: {
					userId,
					role: roleId,
					IDCardFront: imageUrls[0].secure_url,
					IDCardBack: imageUrls[1].secure_url,
					cardPhoto: imageUrls[2].secure_url,
					createdAt: new Date(),
				},
			});
		} catch (e) {
			throw e;
		}
	}

	async responseToTeamInvitation(
		responseToTeamInvitationDTO: ResponseToTeamInvitationDTO,
	): Promise<string> {
		const { invitationId, option, invitedUserId } = responseToTeamInvitationDTO;

		try {
			const existedInvitation = await this.prisma.teamInvitation.findUnique({
				where: {
					id: invitationId,
					status: InvitationStatus.PENDING,
					invitedUserId,
				},

				include: {
					invitedUser: true,
					team: true,
				},
			});

			if (!existedInvitation) {
				throw new BadRequestException("This invitation does not exist");
			}

			let athleteName: string = existedInvitation.invitedUser.name;

			const teamInvitation: TeamInvitation =
				await this.prisma.teamInvitation.update({
					where: { id: invitationId },
					data: {
						status: option
							? InvitationStatus.ACCEPTED
							: InvitationStatus.REJECTED,
					},
				});

			if (option) {
				await this.prisma.userTeam.create({
					data: {
						userId: existedInvitation.invitedUserId,
						teamId: existedInvitation.teamId,
					},
				});
			}

			await this.notificationsRepository.createNotification(
				{
					title: option ? "Accept join team" : "Reject join team",
					message: `${athleteName} ${option ? "accepted your invitation" : "rejected your invitation"}`,
					type: option
						? NotificationTypeMap.Approve.id
						: NotificationTypeMap.Reject.id,
					teamInvitationId: teamInvitation.id,
				},
				[existedInvitation.team.teamLeaderId],
			);
			//
			// const createdNotification = await prisma.notification.create({
			// 	data: {
			// 		title: option ? "Accept join team" : "Reject join team",
			// 		message: `${athleteName} ${option ? "accepted your invitation" : "rejected your invitation"}`,
			// 		typeId: NotificationTypeMap.Reject.id,
			// 		teamInvitationId: teamInvitation.id,
			// 	},
			// });
			//
			// await prisma.userNotification.create({
			// 	data: {
			// 		notificationId: createdNotification.id,
			// 		userId: existedInvitation.team.teamLeaderId,
			// 	},
			// });

			return option ? "Accept Successfully" : "Reject Successfully";
		} catch (e) {
			console.error("Response to invitation failed", e);
			throw e;
		}
	}

	async leaveTeam(leaveTeamDTO: LeaveTeamDTO): Promise<string> {
		const { teamId, user, reason } = leaveTeamDTO;

		try {
			const teamExisted: Team = await this.prisma.team.findUnique({
				where: {
					id: teamId,
				},
			});

			if (!teamExisted) {
				throw new BadRequestException("Team does not exist!");
			}

			const userInTeam: UserTeam = await this.prisma.userTeam.findUnique({
				where: {
					userId_teamId: {
						userId: user.id,
						teamId,
					},
				},
			});

			if (!userInTeam) {
				throw new BadRequestException("User not in this team");
			}

			const userName = user.name;

			const teamRequest: TeamRequest = await this.prisma.teamRequest.create({
				data: {
					leaveTeamReason: reason,
					teamMemberId: user.id,
					teamId,
					type: TeamRequestType.LEAVE_TEAM,
				},
			});

			const createNotificationDTO: CreateNotificationDTO = {
				message: `${userName} want to leave team`,
				title: `${userName} want to leave team`,
				type: NotificationTypeMap.Leave_Team.id,
				teamRequestId: teamRequest.id,
			};

			await this.notificationsRepository.createNotification(
				createNotificationDTO,
				[teamExisted.teamLeaderId],
			);

			return "Leave team request send successfully";
		} catch (e) {
			console.error("Leave team request failed", e.message, e.stack);
			throw e;
		}
	}

	async requestJoinTeam(
		requestJoinTeamDTO: RequestJoinTeamDTO,
	): Promise<string> {
		const { teamId, user } = requestJoinTeamDTO;

		try {
			const [teamExisted, checkAlreadyInTeam, requestExisted] =
				await Promise.all([
					this.prisma.team.findUnique({ where: { id: teamId } }),
					this.prisma.userTeam.findUnique({
						where: { userId_teamId: { userId: user.id, teamId } },
					}),
					this.prisma.teamRequest.findFirst({
						where: { teamId, teamMemberId: user.id },
					}),
				]);

			if (requestExisted) {
				throw new BadRequestException(
					"You already send request to join this team",
				);
			}

			if (checkAlreadyInTeam) {
				throw new BadRequestException("User already in this team");
			}

			if (!teamExisted) {
				throw new BadRequestException("Team does not exist");
			}

			const teamRequest: TeamRequest = await this.prisma.teamRequest.create({
				data: {
					teamId,
					type: TeamRequestType.JOIN_TEAM,
					status: TeamRequestStatus.PENDING,
					teamMemberId: user.id,
				},
			});

			const userName = user.name;

			const createNotificationDTO: CreateNotificationDTO = {
				message: `${userName} want to join team`,
				title: `${userName} want to join team`,
				type: NotificationTypeMap.Join_Team.id,
				teamRequestId: teamRequest.id,
			};

			await this.notificationsRepository.createNotification(
				createNotificationDTO,
				[teamExisted.teamLeaderId],
			);

			return "Request to join team successfully";
		} catch (e) {
			console.error("Request join team failed", e.message, e.stack);
			throw e;
		}
	}

	async responseToTransferTeamLeader(
		responseToTransferTeamLeaderDTO: ResponseTeamLeaderTransferDTO,
	): Promise<string> {
		const { requestId, option, user } = responseToTransferTeamLeaderDTO;
		console.log(responseToTransferTeamLeaderDTO);

		try {
			const requestExisted = await this.prisma.teamRequest.findUnique({
				where: { id: requestId, teamMemberId: user.id },
				include: { team: true },
			});

			if (!requestExisted) {
				throw new BadRequestException("Request not existed");
			}

			const { team } = requestExisted;
			const oldTeamLeaderId = team.teamLeaderId;
			const newStatus = option
				? TeamRequestStatus.APPROVED
				: TeamRequestStatus.REJECTED;

			await this.prisma.teamRequest.update({
				where: { id: requestId },
				data: { status: newStatus },
			});

			if (option) {
				await this.transferTeamLeadership(
					requestExisted.teamId,
					oldTeamLeaderId,
					user.id,
				);
			}

			await this.createNotification(
				option,
				user.name,
				requestId,
				oldTeamLeaderId,
			);

			return option
				? "Accept transfer team leader request successfully"
				: "Reject transfer team leader request successfully";
		} catch (e) {
			console.error("Response to transferTeamLeader", e.message, e.stack);
			throw e;
		}
	}

	private async transferTeamLeadership(
		teamId: string,
		oldLeaderId: string,
		newLeaderId: string,
	) {
		await this.prisma.$transaction([
			this.prisma.team.update({
				where: { id: teamId },
				data: { teamLeaderId: newLeaderId },
			}),
			this.prisma.userTeam.update({
				where: { userId_teamId: { userId: newLeaderId, teamId } },
				data: { role: "LEADER" },
			}),
			this.prisma.userTeam.update({
				where: { userId_teamId: { userId: oldLeaderId, teamId } },
				data: { role: "MEMBER" },
			}),
		]);
	}

	private async createNotification(
		option: boolean,
		athleteName: string,
		requestId: string,
		recipientId: string,
	) {
		const title = option
			? "Accept become new team leader"
			: "Reject become new team leader";
		const message = `${athleteName} ${option ? "accepted your transfer team leader request" : "rejected your transfer team leader request"}`;
		const type = option
			? NotificationTypeMap.Approve.id
			: NotificationTypeMap.Reject.id;

		await this.notificationsRepository.createNotification(
			{
				title,
				message,
				type,
				teamRequestId: requestId,
			},
			[recipientId],
		);
	}

	async getTournamentRegistrationByUserId(
		userID: string,
	): Promise<TournamentRegistration[]> {
		try {
			return this.prisma.tournamentRegistration.findMany({
				where: {
					OR: [
						{
							userId: userID,
						},

						{
							partnerId: userID,
						},
					],
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

					tournament: true,
					tournamentEvent: true,
				},
			});
		} catch (e) {
			console.error("getTournamentRegistrationByUserId failed", e);
			throw e;
		}
	}
}
