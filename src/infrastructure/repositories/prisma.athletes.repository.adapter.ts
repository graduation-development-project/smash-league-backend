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
import { request } from "express";
import { CreateNotificationDTO } from "../../domain/dtos/notifications/create-notification.dto";
import { ResponseTeamLeaderTransferDTO } from "../../domain/dtos/athletes/response-team-leader-transfer.dto";

const streamifier = require("streamifier");

@Injectable()
export class PrismaAthletesRepositoryAdapter implements AthletesRepositoryPort {
	constructor(
		private prisma: PrismaService,
		private uploadService: UploadService,
		@Inject("NotificationRepository")
		private notificationsRepository: NotificationsRepositoryPort,
	) {}

	async registerTournament(
		registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentRegistration> {
		// try {
		// 	const { tournamentId, partnerId, userId, tournamentDisciplineId } =
		// 		registerTournamentDTO;

		// 	// const tournamentExisted = await this.prisma.tournament.findUnique({
		// 	// 	where: { id: tournamentId },
		// 	// });

		// 	// if (!tournamentExisted) {
		// 	// 	throw new BadRequestException("Tournament not found");
		// 	// }

		// 	const userRegistered: TournamentParticipant =
		// 		await this.prisma.tournamentParticipant.findFirst({
		// 			where: {
		// 				tournamentId,
		// 				OR: [
		// 					{ userId, eventType }, // * User registered as a player
		// 					{ partnerId: userId }, // * User is registered as a partner
		// 				],
		// 			},
		// 		});

		// 	// if (userRegistered) {
		// 	// 	throw new BadRequestException(
		// 	// 		"User already registered this tournament event type",
		// 	// 	);
		// 	// }

		// 	// // * Check if partner is registered
		// 	// if (tournamentDisciplineId.toUpperCase() === EventTypesEnum.DOUBLE.toUpperCase()) {
		// 	// 	const partnerRegistered: TournamentRegistration =
		// 	// 		await this.prisma.tournamentRegistration.findFirst({
		// 	// 			where: {
		// 	// 				tournamentId,
		// 	// 				OR: [
		// 	// 					{ userId: partnerId, tournamentDisciplineId: eventType },
		// 	// 					{ partnerId },
		// 	// 				],
		// 	// 			},
		// 	// 		});

		// 	// 	if (partnerRegistered) {
		// 	// 		throw new BadRequestException(
		// 	// 			"Your partner already registered this tournament event type",
		// 	// 		);
		// 	// 	}
		// 	// }

		// 	// return await this.prisma.tournamentRegistration.create({
		// 	// 	data: {
		// 	// 		tournamentId,
		// 	// 		userId,
		// 	// 		tournamentDisciplineId: eventType,
		// 	// 		partnerId:
		// 	// 			eventType.toUpperCase() === EventTypesEnum.DOUBLE.toUpperCase()
		// 	// 				? partnerId || null
		// 	// 				: null,
		// 	// 	},
		// 	// });
		// // } catch (e) {
		// // 	throw e;
		// // }
		return null;
	}

	async getParticipatedTournaments(
		userID: string,
		tournamentStatus: string,
	): Promise<Tournament[]> {
		try {
			return this.prisma.tournament.findMany({
				where: {
					registrations: {
						some: {
							OR: [
								{ userId: userID }, //* User participated as a player
								{ partnerId: userID }, //* User participated as a partner
							],
						},
					},

					...(tournamentStatus
						? { status: TournamentStatusEnum[tournamentStatus] }
						: {}),
				},
			});
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

			const roleExisted: UserRole = await this.prisma.userRole.findUnique({
				where: {
					userId_roleId: {
						userId,
						roleId: role,
					},
				},
			});

			if (roleExisted) {
				throw new BadRequestException("This role is already registered");
			}

			const verificationExisted = await this.prisma.userVerification.findFirst({
				where: {
					userId,
					role,
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
					role,
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

			let athleteName: string = `${existedInvitation.invitedUser.firstName} ${existedInvitation.invitedUser.lastName}`;

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

			const userName = `${user.firstName} ${user.lastName}`;

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

			const userName = `${user.firstName} ${user.lastName}`;

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
			const requestExisted: TeamRequest =
				await this.prisma.teamRequest.findUnique({
					where: {
						id: requestId,
						teamMemberId: user.id,
					},
				});

			if (!requestExisted) {
				throw new BadRequestException("Request not existed");
			}

			let athleteName: string = `${user.firstName} ${user.lastName}`;

			const teamRequest = await this.prisma.teamRequest.update({
				where: { id: requestId },
				data: {
					status: option
						? TeamRequestStatus.APPROVED
						: TeamRequestStatus.REJECTED,
				},

				include: {
					team: true,
				},
			});

			const oldTeamLeaderId: string = teamRequest.team.teamLeaderId;

			if (option) {
				await this.prisma.team.update({
					where: {
						id: requestExisted.teamId,
					},
					data: {
						teamLeaderId: user.id,
					},
				});
			}

			await this.notificationsRepository.createNotification(
				{
					title: option
						? "Accept become new team leader"
						: "Reject become new team leader",
					message: `${athleteName} ${option ? "accepted your transfer team leader request" : "rejected your transfer team leader request"}`,
					type: option
						? NotificationTypeMap.Approve.id
						: NotificationTypeMap.Reject.id,
					teamRequestId: requestId,
				},
				[oldTeamLeaderId],
			);

			return option
				? "Accept transfer team leader request successfully"
				: "Reject transfer team leader request successfully";
		} catch (e) {
			console.error("Response to transferTeamLeader", e.message, e.stack);
			throw e;
		}
	}
}
