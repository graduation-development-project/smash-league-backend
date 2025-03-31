import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { TeamLeadersRepositoryPort } from "../../domain/interfaces/repositories/team-leaders.repository.port";
import { PrismaService } from "../services/prisma.service";
import {
	InvitationStatus,
	Notification,
	ReasonType,
	Team,
	TeamInvitation,
	TeamRequest,
	TeamRequestStatus,
	TeamRequestType,
	TeamRole,
	TeamStatus,
	UserTeam,
} from "@prisma/client";
import { SendInvitationDTO } from "../../domain/dtos/team-leaders/send-invitation.dto";
import { NotificationTypeMap } from "../enums/notification-type.enum";
import { UploadService } from "../services/upload.service";
import { CreateTeamDTO } from "../../domain/dtos/team-leaders/create-team.dto";
import { RoleMap } from "../enums/role.enum";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { CreateNotificationDTO } from "../../domain/dtos/notifications/create-notification.dto";
import { NotificationsRepositoryPort } from "../../domain/interfaces/repositories/notifications.repository.port";
import { EditTeamDTO } from "../../domain/dtos/team-leaders/edit-team.dto";
import { RemoveTeamMemberDTO } from "../../domain/dtos/team-leaders/remove-team-member.dto";
import { ResponseLeaveTeamRequestDTO } from "../../domain/dtos/team-leaders/response-leave-team-request.dto";
import { TransferTeamLeaderRoleDTO } from "../../domain/dtos/team-leaders/transfer-team-leader-role.dto";

@Injectable()
export class PrismaTeamLeadersRepositoryAdapter
	implements TeamLeadersRepositoryPort
{
	constructor(
		private prismaService: PrismaService,
		private uploadService: UploadService,
		@InjectQueue("emailQueue") private emailQueue: Queue,
		@InjectQueue("teamQueue") private teamQueue: Queue,
		@Inject("NotificationRepository")
		private notificationsRepository: NotificationsRepositoryPort,
	) {}

	async createTeam(createTeamDTO: CreateTeamDTO): Promise<Team> {
		let { teamLeader, teamName, logo, description } = createTeamDTO;

		try {
			const existedTeam: Team[] = await this.prismaService.team.findMany({
				where: { teamLeaderId: teamLeader.id },
			});

			if (existedTeam.length >= 3) {
				throw new BadRequestException("You cannot manage more than 3 teams");
			}

			const existedTeamName = await this.prismaService.team.findMany({
				where: {
					teamName: { equals: teamName, mode: "insensitive" },
					status: TeamStatus.ACTIVE,
				},
			});

			if (existedTeamName.length > 0) {
				throw new BadRequestException("This team name is already in use");
			}

			const folderName = `team/${new Date().toISOString().split("T")[0]}/${teamName}`;

			const imageUrls = await this.uploadService.uploadFiles(
				logo,
				folderName,
				teamName,
			);

			if (imageUrls.length <= 0) {
				throw new BadRequestException("Upload images fail");
			}

			return this.prismaService.$transaction(async (prisma) => {
				const createdTeam: Team = await prisma.team.create({
					data: {
						teamLeaderId: teamLeader.id,
						teamName,
						logo: imageUrls[0].secure_url,
						description,
					},
				});

				await prisma.userTeam.create({
					data: {
						teamId: createdTeam.id,
						userId: teamLeader.id,
						role: TeamRole.LEADER,
					},
				});

				//* Add role team leader if user dont have
				if (!teamLeader.userRoles.includes(RoleMap.Team_Leader.id)) {
					await prisma.userRole.create({
						data: {
							userId: teamLeader.id,
							roleId: RoleMap.Team_Leader.id,
						},
					});
				}

				return createdTeam;
			});
		} catch (e) {
			console.error(`Create team failed: ${e.message}`, e.stack);
			throw e;
		}
	}

	async sendTeamInvitation(
		sendInvitationDTO: SendInvitationDTO,
	): Promise<string> {
		const { teamId, invitedUserEmail } = sendInvitationDTO;

		try {
			const [userExisted, teamExisted] = await Promise.all([
				this.prismaService.user.findUnique({
					where: { email: invitedUserEmail, isVerified: true },
				}),
				this.prismaService.team.findUnique({
					where: { id: teamId },
					include: { teamLeader: true },
				}),
			]);

			if (!userExisted) {
				throw new BadRequestException("User not exists");
			}

			if (!teamExisted) {
				throw new BadRequestException("Team not exists");
			}

			const userInTeam = await this.prismaService.userTeam.findUnique({
				where: { userId_teamId: { teamId, userId: userExisted.id } },
			});

			if (userInTeam) {
				throw new BadRequestException("This user already in your team");
			}

			const existingInvitation =
				await this.prismaService.teamInvitation.findFirst({
					where: {
						teamId,
						invitedUserId: userExisted.id,
						status: InvitationStatus.PENDING,
					},
				});

			const oneDayInMs: number = 24 * 60 * 60 * 1000;
			const now = new Date();
			let teamInvitation: TeamInvitation = null;

			if (existingInvitation?.status === InvitationStatus.PENDING) {
				let timeSinceLastInvitation: number;

				if (existingInvitation.updatedAt !== null) {
					timeSinceLastInvitation =
						now.getTime() - existingInvitation.updatedAt.getTime();
				} else {
					timeSinceLastInvitation =
						now.getTime() - existingInvitation.createdAt.getTime();
				}

				if (timeSinceLastInvitation < oneDayInMs) {
					throw new BadRequestException(
						"You need to wait 1 day to create a new invitation",
					);
				}

				teamInvitation = await this.prismaService.teamInvitation.update({
					where: { id: existingInvitation.id },
					data: { updatedAt: now, status: InvitationStatus.PENDING },
				});
			} else {
				teamInvitation = await this.prismaService.teamInvitation.create({
					data: { teamId, invitedUserId: userExisted.id },
				});
			}

			const message = `You have an invitation from team ${teamExisted.teamName}`;

			await this.notificationsRepository.createNotification(
				{
					type: NotificationTypeMap.Invitation.id,
					message,
					title: message,
					teamInvitationId: teamInvitation.id,
				},
				[userExisted.id],
			);

			// const notification: Notification =
			// 	await this.prismaService.notification.create({
			// 		data: {
			// 			typeId: NotificationTypeMap.Invitation.id,
			// 			message,
			// 			title: message,
			// 			teamInvitationId: teamInvitation.id,
			// 		},
			// 	});
			//
			// await this.prismaService.userNotification.create({
			// 	data: { userId: userExisted.id, notificationId: notification.id },
			// });

			await this.emailQueue.add("sendEmail", {
				to: invitedUserEmail,
				subject: `You have an invitation from team ${teamExisted.teamName}`,
				template: "team-invitation.hbs",
				context: {
					teamLeader: teamExisted.teamLeader.name,
					teamName: teamExisted.teamName,
				},
			});

			return "Send invitation successfully!";
		} catch (e) {
			console.error(`Failed to send invitation: ${e.message}`, e.stack);
			throw e;
		}
	}

	async removeTeam(teamId: string, teamLeaderId: string): Promise<string> {
		try {
			const [team, usersTeam] = await Promise.all([
				this.prismaService.team.findUnique({
					where: { id: teamId, teamLeaderId, status: TeamStatus.ACTIVE },
				}),
				this.prismaService.userTeam.findMany({ where: { teamId } }),
			]);

			if (!team) {
				throw new BadRequestException(`Team does not exist.`);
			}

			// * Send notifications for team members before disband
			if (usersTeam.length > 0) {
				const date = new Date();
				date.setDate(date.getDate() + 7);

				const day: string = String(date.getDate()).padStart(2, "0");
				const month: string = String(date.getMonth() + 1).padStart(2, "0");
				const year: string = String(date.getFullYear());

				const receiverList: string[] = usersTeam.map(
					(user: UserTeam) => user.userId,
				);
				const createNotificationDTO: CreateNotificationDTO = {
					type: NotificationTypeMap.Disband.id,
					message: `Team Leader of ${team.teamName} has decided to delete the team on ${day}/${month}/${year}. Please back up necessary data before this time.`,
					title: `Your team (${team.teamName}) will be disbanded`,
				};

				await this.notificationsRepository.createNotification(
					createNotificationDTO,
					receiverList,
				);

				await this.prismaService.team.update({
					where: {
						id: teamId,
					},
					data: {
						status: TeamStatus.WAITING_DISBAND,
					},
				});
			}

			await this.teamQueue.add("removeTeam", {
				team,
			});

			return "Team will be deleted in 24 hours.";
		} catch (e) {
			console.error(`Failed to remove team: ${teamId}`, e.message, e.stack);
			throw e;
		}
	}

	async editTeam(editTeamDTO: EditTeamDTO): Promise<Team> {
		const { teamId, teamName, description, logo, teamLeaderId } = editTeamDTO;
		try {
			const team: Team = await this.prismaService.team.findUnique({
				where: {
					id: teamId,
					teamLeaderId: teamLeaderId,
				},
			});

			if (!team) {
				throw new BadRequestException(`Team does not exist.`);
			}

			const updateData: Partial<Team> = {};

			if (logo.length > 0) {
				const folderName = `team/${new Date().toISOString().split("T")[0]}/${teamName || team.teamName}`;

				const imageUrls = await this.uploadService.uploadFiles(
					logo,
					folderName,
					teamName || team.teamName,
				);

				if (!imageUrls.length)
					throw new BadRequestException("Upload images failed");

				updateData.logo = imageUrls[0].secure_url;
			}

			if (teamName) {
				const existedTeamName = await this.prismaService.team.findMany({
					where: {
						teamName: { equals: teamName, mode: "insensitive" },
						status: TeamStatus.ACTIVE,
						id: { not: teamId },
					},
				});

				if (existedTeamName.length > 0) {
					throw new BadRequestException("This team name is already in use");
				}

				updateData.teamName = teamName;
			}

			if (description !== undefined && description !== team.description) {
				updateData.description = description;
			}

			return await this.prismaService.team.update({
				where: { id: teamId },
				data: updateData,
			});
		} catch (e) {
			console.error("Edit team failed", e.message, e.stack);
			throw e;
		}
	}

	async removeTeamMember(
		removeTeamMemberDTO: RemoveTeamMemberDTO,
	): Promise<string> {
		const { teamMemberIds, reason, teamId, teamLeaderId } = removeTeamMemberDTO;

		try {
			const teamExisted: Team = await this.prismaService.team.findUnique({
				where: { id: teamId, teamLeaderId },
			});

			if (!teamExisted) {
				throw new BadRequestException("Team does not exist.");
			}

			if (teamMemberIds.length <= 0) {
				throw new BadRequestException("Remove list cannot empty");
			}

			const checkIncludeTeamLeader = teamMemberIds.find(
				(id) => id === teamLeaderId,
			);

			if (checkIncludeTeamLeader) {
				throw new BadRequestException(
					"Remove list can not include team leader",
				);
			}

			await this.prismaService.$transaction(async (prisma) => {
				await prisma.userTeam.deleteMany({
					where: {
						teamId,
						userId: { in: teamMemberIds },
					},
				});

				await prisma.reason.create({
					data: {
						reason,
						type: ReasonType.REMOVE_TEAM_MEMBER,
					},
				});

				const createNotificationDTO = {
					title: `You were removed from team ${teamExisted.teamName}`,
					message: reason,
					type: NotificationTypeMap.Kick.id,
				};

				await this.notificationsRepository.createNotification(
					createNotificationDTO,
					teamMemberIds,
				);
			});

			return "Remove team member successfully";
		} catch (e) {
			console.error("Remove teamMember failed", e.message, e.stackTrace);
			throw e;
		}
	}

	async responseLeaveTeamRequest(
		responseLeaveTeamRequest: ResponseLeaveTeamRequestDTO,
	): Promise<string> {
		const { requestId, rejectReason, option, user, teamId } =
			responseLeaveTeamRequest;

		try {
			const requestExisted = await this.prismaService.teamRequest.findUnique({
				where: {
					id: requestId,
					type: TeamRequestType.LEAVE_TEAM,
					status: TeamRequestStatus.PENDING,
				},
			});

			if (!requestExisted) {
				throw new BadRequestException("Request does not exist.");
			}

			const updateRequested: TeamRequest =
				await this.prismaService.teamRequest.update({
					where: { id: requestId },
					data: {
						status: option
							? TeamRequestStatus.APPROVED
							: TeamRequestStatus.REJECTED,
					},
				});

			if (option) {
				await this.prismaService.userTeam.delete({
					where: {
						userId_teamId: { userId: requestExisted.teamMemberId, teamId },
					},
				});
			} else {
				await this.prismaService.reason.create({
					data: {
						type: ReasonType.OUT_TEAM_REJECTION,
						teamRequestId: requestId,
						reason: rejectReason,
					},
				}),
					await this.notificationsRepository.createNotification(
						{
							title: `Team Leader did not accept your leave team request`,
							message: rejectReason,
							type: NotificationTypeMap.Reject.id,
							teamRequestId: updateRequested.id,
						},
						[requestExisted.teamMemberId],
					);
			}

			return option
				? "Accepted Leave Team Request successfully"
				: "Rejected Leave Team Request successfully";
		} catch (e) {
			console.error("Response leave team request failed", e.message, e.stack);
			throw e;
		}
	}

	async responseJoinTeamRequest(
		responseJoinTeamRequest: ResponseLeaveTeamRequestDTO,
	): Promise<string> {
		const { requestId, rejectReason, option, teamId } = responseJoinTeamRequest;

		try {
			const requestExisted: TeamRequest =
				await this.prismaService.teamRequest.findUnique({
					where: {
						id: requestId,
					},
				});

			if (!requestExisted) {
				throw new BadRequestException("Request does not exist.");
			}

			const userAlreadyInTeam = await this.prismaService.userTeam.findUnique({
				where: {
					userId_teamId: {
						userId: requestExisted.teamMemberId,
						teamId,
					},
				},
			});

			if (userAlreadyInTeam) {
				throw new BadRequestException("This athlete already in team");
			}

			const updatedRequest: TeamRequest =
				await this.prismaService.teamRequest.update({
					where: { id: requestId },
					data: {
						status: option
							? TeamRequestStatus.APPROVED
							: TeamRequestStatus.REJECTED,
					},
				});

			if (option) {
				await this.prismaService.userTeam.create({
					data: {
						teamId,
						userId: requestExisted.teamMemberId,
					},
				});
			} else {
				await this.prismaService.reason.create({
					data: {
						type: ReasonType.JOIN_TEAM_REJECTION,
						teamRequestId: requestId,
						reason: rejectReason,
					},
				});

				await this.notificationsRepository.createNotification(
					{
						title: `Team Leader did not accept your join team request`,
						message: rejectReason,
						type: NotificationTypeMap.Reject.id,
						teamRequestId: updatedRequest.id,
					},
					[requestExisted.teamMemberId],
				);
			}

			return option
				? "Accepted join Team Request successfully"
				: "Rejected join Team Request successfully";
		} catch (e) {
			console.error("Response join team request failed", e.message, e.stack);
			throw e;
		}
	}

	async transferTeamLeaderRole(
		transferTeamLeaderRoleDTO: TransferTeamLeaderRoleDTO,
	): Promise<TeamRequest> {
		const { teamId, newTeamLeaderId, user } = transferTeamLeaderRoleDTO;

		try {
			const teamExisted: Team = await this.prismaService.team.findUnique({
				where: {
					id: teamId,
					teamLeaderId: user.id,
				},
			});

			const requestExisted = await this.prismaService.teamRequest.findFirst({
				where: {
					teamId,
					teamMemberId: newTeamLeaderId,
					type: TeamRequestType.TRANSFER_TEAM_LEADER,
					status: "PENDING",
				},
			});

			if (requestExisted) {
				throw new BadRequestException("This request is already existed");
			}

			if (newTeamLeaderId === user.id) {
				throw new BadRequestException(
					"You are already team leader of this team",
				);
			}

			if (!teamExisted) {
				throw new BadRequestException("You are not team leader of this team");
			}

			const isNewLeaderInTeam: UserTeam =
				await this.prismaService.userTeam.findUnique({
					where: {
						userId_teamId: {
							userId: newTeamLeaderId,
							teamId,
						},
					},
				});

			if (!isNewLeaderInTeam) {
				throw new BadRequestException("This user is not in this team");
			}

			const teamRequest = await this.prismaService.teamRequest.create({
				data: {
					teamMemberId: newTeamLeaderId,
					type: TeamRequestType.TRANSFER_TEAM_LEADER,
					teamId,
				},
			});

			const createNotificationDTO = {
				title: `You are requested to be new team leader of team ${teamExisted.teamName}`,
				message: `Your team leader has sent you a request to become a new team leader of ${teamExisted.teamName}`,
				type: NotificationTypeMap.Transfer_Team_Leader.id,
				teamRequestId: teamRequest.id,
			};

			await this.notificationsRepository.createNotification(
				createNotificationDTO,
				[newTeamLeaderId],
			);

			return teamRequest;
		} catch (e) {
			console.error("Transfer team leader role failed", e.message, e.stack);
			throw e;
		}
	}
}
