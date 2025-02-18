import {Notification} from "@prisma/client";


export interface NotificationsRepositoryPort {
	getNotificationsByUserID(userID: string): Promise<Notification[]>;
}
