import { BadRequestException, Injectable } from "@nestjs/common";
import { TeamLeadersRepositoryPort } from "../../domain/repositories/team-leaders.repository.port";
import { PrismaService } from "../services/prisma.service";
import {
	InvitationStatus,
	Notification,
	Team,
	User,
	UserTeam,
} from "@prisma/client";
import { SendInvitationDTO } from "../../domain/dtos/team-leaders/send-invitation.dto";
import { NotificationTypeMap } from "../enums/notification-type.enum";
import { UploadService } from "../services/upload.service";
import { CreateTeamDTO } from "../../domain/dtos/team-leaders/create-team.dto";
import { convertToLocalTime } from "../util/convert-to-local-time.util";
import { RoleMap } from "../enums/role.enum";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class PrismaTeamLeadersRepositoryAdapter
	implements TeamLeadersRepositoryPort
{
	constructor(
		private prismaService: PrismaService,
		private uploadService: UploadService,
		@InjectQueue("emailQueue") private emailQueue: Queue,
	) {}

	async createTeam(createTeamDTO: CreateTeamDTO): Promise<Team> {
		let { teamLeaderId, teamName, logo, description } = createTeamDTO;

		try {
			const existedTeam: Team[] = await this.prismaService.team.findMany({
				where: { teamLeaderId },
			});

			if (existedTeam.length >= 3) {
				throw new BadRequestException("You cannot manage more than 3 teams");
			}

			const existedTeamName = await this.prismaService.team.findMany({
				where: {
					teamName: { contains: teamName, mode: "insensitive" },
				},
			});

			if (existedTeamName.length > 0) {
				throw new BadRequestException("This team name is already in use");
			}

			const folderName = `verification-information/${new Date().toISOString().split("T")[0]}/${teamName}`;

			const imageUrls = await this.uploadService.uploadFiles(
				logo,
				folderName,
				teamName,
			);

			console.log(imageUrls);

			if (imageUrls.length <= 0) {
				throw new BadRequestException("Upload images fail");
			}

			return this.prismaService.$transaction(async (prisma) => {
				const createdTeam: Team = await prisma.team.create({
					data: {
						teamLeaderId,
						teamName,
						logo: imageUrls[0].secure_url,
						description,
					},
				});

				await prisma.userTeam.create({
					data: {
						teamId: createdTeam.id,
						userId: teamLeaderId,
					},
				});

				await prisma.userRole.create({
					data: {
						userId: teamLeaderId,
						roleId: RoleMap.Team_Leader.id,
					},
				});

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

			await this.prismaService.$transaction(async (prisma) => {
				const oneDayInMs = 24 * 60 * 60 * 1000;
				const now = new Date();

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

					await prisma.teamInvitation.update({
						where: { id: existingInvitation.id },
						data: { updatedAt: now, status: InvitationStatus.PENDING },
					});

				} else {
					await prisma.teamInvitation.create({
						data: { teamId, invitedUserId: userExisted.id },
					});
				}

				const message = `You have an invitation from team ${teamExisted.teamName}`;

				const notification: Notification = await prisma.notification.create({
					data: {
						typeId: NotificationTypeMap.Invitation.id,
						message,
						title: message,
					},
				});

				await prisma.userNotification.create({
					data: { userId: userExisted.id, notificationId: notification.id },
				});

				await this.emailQueue.add("sendEmail", {
					to: invitedUserEmail,
					subject: `You have an invitation from team ${teamExisted.teamName}`,
					template: "team-invitation.hbs",
					context: {
						teamLeader: `${teamExisted.teamLeader.firstName} ${teamExisted.teamLeader.lastName}`,
						teamName: teamExisted.teamName,
					},
				});
			});

			return "Send invitation successfully!";
		} catch (e) {
			console.error(`Failed to send invitation: ${e.message}`, e.stack);
			throw e;
		}
	}
}
