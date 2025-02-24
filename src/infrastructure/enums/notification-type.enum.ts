import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const NotificationTypeMap = {
	Reject: { id: null, name: "Reject" },
	Approve: { id: null, name: "Approve" },
	Invitation: { id: null, name: "Invitation" },
};

export async function loadNotificationTypeMap() {
	const notificationType = await prisma.notificationType.findMany();
	console.log(notificationType);

	notificationType.forEach((type) => {
		if (NotificationTypeMap[type.typeOfNotification]) {
			NotificationTypeMap[type.typeOfNotification].id = type.id;
		}
	});
}

export type NotificationType = keyof typeof NotificationTypeMap;
