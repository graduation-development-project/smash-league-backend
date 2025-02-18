import { Injectable } from "@nestjs/common";
import { Notification, PrismaClient } from "@prisma/client";
import { NotificationsRepositoryPort } from "../../domain/repositories/notifications.repository.port";

@Injectable()
export class PrismaNotificationsRepositoryAdapter
	implements NotificationsRepositoryPort
{
	constructor(private prisma: PrismaClient) {}

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

			console.log(
				notifications.map((notification) => notification.notification),
			);

			return notifications.map((notification) => notification.notification);
		} catch (e) {
			throw e;
		}
	}
}
