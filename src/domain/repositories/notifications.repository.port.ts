import { Notification } from "@prisma/client";
import { CreateNotificationDTO } from "../dtos/notifications/create-notification.dto";

export interface NotificationsRepositoryPort {
	getNotificationsByUserID(userID: string): Promise<Notification[]>;

	createNotification(
		createNotificationDTO: CreateNotificationDTO,
		receiverList: string[],
	): Promise<string>;
}
