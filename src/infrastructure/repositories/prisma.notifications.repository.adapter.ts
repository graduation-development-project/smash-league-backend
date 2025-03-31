import { BadRequestException, Injectable } from "@nestjs/common";
import { Notification, PrismaClient, UserNotification } from "@prisma/client";
import { NotificationsRepositoryPort } from "../../domain/repositories/notifications.repository.port";
import { CreateNotificationDTO } from "../../domain/dtos/notifications/create-notification.dto";
import { convertToLocalTime } from "../util/convert-to-local-time.util";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { PrismaService } from "../services/prisma.service";

@Injectable()
export class PrismaNotificationsRepositoryAdapter
	implements NotificationsRepositoryPort
{
	constructor(
		private prisma: PrismaService,
		@InjectQueue("notificationQueue") private notificationQueue: Queue,
	) {}

	async getNotificationsByUserID(userID: string): Promise<Notification[]> {
		try {
			const notifications = await this.prisma.userNotification.findMany({
				where: {
					userId: userID,
				},
				include: {
					notification: {
						include: {
							type: true,
							teamInvitation: {
								select: {
									status: true,
									team: {
										select: {
											id: true,
											logo: true,
										},
									},
								},
							},
							teamRequest: {
								select: {
									status: true,
									team: {
										select: {
											id: true,
											logo: true,
										},
									},
								},
							},
							tournamentRegistration: {
								select: {
									status: true,
								},
							},
						},
					},
				},
			});
			return notifications.map((notification) => ({
				...notification.notification,
				createdAt: notification.createdAt,
			}));
		} catch (e) {
			throw e;
		}
	}

	async createNotification(
		createNotificationDTO: CreateNotificationDTO,
		receiverList: string[],
	): Promise<string> {
		const {
			title,
			message,
			type,
			teamRequestId,
			teamInvitationId,
			tournamentRegistrationId,
		} = createNotificationDTO;

		try {
			if (!receiverList || receiverList.length === 0) {
				throw new BadRequestException("Receiver list is required");
			}

			console.log("teamRequestId", teamRequestId);

			const notification: Notification = await this.prisma.notification.create({
				data: {
					message,
					typeId: type,
					title,
					...(teamRequestId && { teamRequestId }),
					...(teamInvitationId && { teamInvitationId }),
					...(tournamentRegistrationId && { tournamentRegistrationId }),
				},
			});

			if (!notification) {
				throw new BadRequestException("create notification failed");
			}

			await this.notificationQueue.addBulk(
				receiverList.map((userId) => ({
					name: "sendNotification",
					data: { userId, notificationId: notification.id },
				})),
			);

			return "Create and send notifications successfully";
		} catch (e) {
			throw e;
		}
	}
}
