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
					notification: true,
				},
			});

			return notifications.map((notification) => notification.notification);
		} catch (e) {
			throw e;
		}
	}

	async createNotification(
		createNotificationDTO: CreateNotificationDTO,
		receiverList: string[],
	): Promise<string> {
		const { title, message, type } = createNotificationDTO;

		try {
			if (!receiverList || receiverList.length === 0) {
				throw new BadRequestException("Receiver list is required");
			}

			const notification: Notification = await this.prisma.notification.create({
				data: {
					message,
					typeId: type,
					title,
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
