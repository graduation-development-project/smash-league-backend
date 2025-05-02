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

		const isUmpire = registrationRole === TournamentRegistrationRole.UMPIRE;
		const isAthlete =
			registrationRole.toUpperCase() === TournamentRegistrationRole.ATHLETE;

		const tournament = await this.getTournamentOrThrow(tournamentId);
		this.validateUserNotOrganizer(tournament.organizerId, user.id);
		this.validateTournamentStatus(tournament.status as TournamentStatus);

		let isDoubleEvent = false;
		let event = null;
		if (!isUmpire) {
			event = await this.getTournamentEventOrThrow(tournamentEventId);
			isDoubleEvent = event.tournamentEvent.toUpperCase().includes("DOUBLE");
		}

		await this.validateUserNotRegistered(
			user.id,
			tournamentId,
			tournamentEventId,
			registrationRole as TournamentRegistrationRole,
		);

		if (isAthlete) {
			await this.validateMaxEventPerPerson(
				user.id,
				tournament.maxEventPerPerson,
			);
		}

		if (fromTeamId) {
			await this.validateTeamExistence(fromTeamId);
		}

		if (!isUmpire) {
			this.validateUserAge(user.dateOfBirth, event.fromAge, event.toAge);
		}

		let partnerId: string | null = null;
		let registrationDocumentPartner: string[] = [];

		if (isDoubleEvent) {
			if (!partnerEmail)
				throw new BadRequestException("Partner is required for double matches");
			const partner = await this.getPartnerOrThrow(partnerEmail);
			await this.validateMaxEventPerPerson(
				partner.id,
				tournament.maxEventPerPerson,
			);
			await this.validatePartnerNotRegistered(
				partner.id,
				tournamentId,
				tournamentEventId,
			);
			partnerId = partner.id;
		}

		const folderName = `tournament-registration/${tournamentId}/${tournamentEventId || "umpire"}/${user.id}`;
		const imageUrls = await this.uploadService.uploadFiles(
			files,
			folderName,
			user.id,
		);
		const registrationDocumentCreator = this.extractFiles(
			imageUrls,
			0,
			3,
			isUmpire ? "umpire" : "creator",
		);

		if (isDoubleEvent) {
			registrationDocumentPartner = this.extractFiles(
				imageUrls,
				3,
				6,
				"partner",
			);
		}

		return this.prisma.tournamentRegistration.create({
			data: {
				tournamentId,
				userId: user.id,
				tournamentEventId: isUmpire ? null : tournamentEventId,
				partnerId: isUmpire ? null : partnerId,
				registrationDocumentCreator,
				registrationDocumentPartner,
				registrationRole:
					registrationRole.toUpperCase() as TournamentRegistrationRole,
				fromTeamId: fromTeamId || null,
			},
		});
	}

	private async getTournamentOrThrow(tournamentId: string) {
		const tournament = await this.prisma.tournament.findUnique({
			where: { id: tournamentId },
		});
		if (!tournament) throw new BadRequestException("Tournament not found");
		return tournament;
	}

	private validateUserNotOrganizer(organizerId: string, userId: string) {
		if (organizerId === userId) {
			throw new BadRequestException(
				"You cannot participate in your own tournament",
			);
		}
	}

	private validateTournamentStatus(status: TournamentStatus) {
		if (status !== TournamentStatus.OPENING_FOR_REGISTRATION) {
			throw new BadRequestException(
				"This tournament is not open for registration",
			);
		}
	}

	private async getTournamentEventOrThrow(eventId: string) {
		const event = await this.prisma.tournamentEvent.findUnique({
			where: { id: eventId },
		});
		if (!event) throw new BadRequestException("Tournament event not found");
		return event;
	}

	private async validateUserNotRegistered(
		userId: string,
		tournamentId: string,
		tournamentEventId: string,
		role: TournamentRegistrationRole,
	) {
		const whereClause = {
			isDeleted: false,
			OR: [
				{ tournamentId: tournamentId, userId },
				{
					OR: [
						{ userId, tournamentEventId },
						{ partnerId: userId, tournamentEventId },
					],
				},
			],
		};
		const existing = await this.prisma.tournamentRegistration.findFirst({
			where: whereClause,
		});

		console.log(existing);

		if (existing)
			throw new BadRequestException(
				role === TournamentRegistrationRole.UMPIRE
					? "You are already registered for this tournament"
					: existing.registrationRole === TournamentRegistrationRole.UMPIRE
						? "You already register tournament as umpire"
						: "You are already registered for this tournament event",
			);
	}

	private async validateMaxEventPerPerson(userId: string, max: number) {
		const registrations = await this.prisma.tournamentParticipants.findMany({
			where: { OR: [{ userId }, { partnerId: userId }] },
		});
		if (registrations.length >= max) {
			throw new BadRequestException(
				`You cannot register more than ${max} events`,
			);
		}
	}

	private async validateTeamExistence(teamId: string) {
		const team = await this.prisma.team.findUnique({ where: { id: teamId } });
		if (!team) throw new BadRequestException("Your team does not exist");
	}

	private validateUserAge(dob: Date, fromAge: number, toAge: number) {
		const age = calculateAgeUtil(dob);
		if (!age || age < fromAge || age > toAge) {
			throw new BadRequestException("Your age is not suitable for this event");
		}
	}

	private extractFiles(
		files: any[],
		from: number,
		to: number,
		label: string,
	): string[] {
		const selected = files.slice(from, to).map((f) => f.secure_url);
		if (selected.length < 3) {
			throw new BadRequestException(
				`You must submit 3 verification documents for ${label}`,
			);
		}
		return selected;
	}

	private async getPartnerOrThrow(email: string) {
		const partner = await this.prisma.user.findUnique({ where: { email } });
		if (!partner) throw new BadRequestException("Partner does not exist");
		return partner;
	}

	private async validatePartnerNotRegistered(
		partnerId: string,
		tournamentId: string,
		eventId: string,
	) {
		const existing = await this.prisma.tournamentRegistration.findFirst({
			where: {
				tournamentId,
				isDeleted: false,
				OR: [
					{ userId: partnerId, tournamentEventId: eventId },
					{ partnerId, tournamentEventId: eventId },
				],
			},
		});
		if (existing)
			throw new BadRequestException("Your partner is already registered");
	}

	async getParticipatedTournaments(
		options: IPaginateOptions,
		userID: string,
		tournamentStatus: TournamentStatus,
	): Promise<IPaginatedOutput<IParticipatedTournamentResponse>> {
		try {
			const page: number =
				parseInt(options.page?.toString()) || DEFAULT_PAGE_NUMBER;
			const perPage: number =
				parseInt(options.perPage?.toString()) || DEFAULT_PAGE_SIZE;
			const skip: number = (page - 1) * perPage;

			const tournaments = await this.prisma.tournamentParticipants.findMany({
				where: {
					userId: userID,
					tournament: {
						status: tournamentStatus,
					},
				},

				include: {
					tournament: true,
				},
			});

			const groupedData = tournaments.reduce((acc, participant) => {
				const tournamentId = participant.tournament.id;

				if (!acc[tournamentId]) {
					acc[tournamentId] = {
						tournament: participant.tournament,
						participants: [],
					};
				}
				delete participant.tournament;
				acc[tournamentId].participants.push(participant);

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
					isDeleted: false,
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
