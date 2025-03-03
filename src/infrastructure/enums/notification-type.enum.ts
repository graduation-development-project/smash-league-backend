import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const NotificationTypeMap = {
	Reject: { id: null, name: "Reject" },
	Approve: { id: null, name: "Approve" },
	Invitation: { id: null, name: "Invitation" },
	Disband: { id: null, name: "Disband" },
	Kick: { id: null, name: "Kick" },
	Leave_Team: { id: null, name: "Leave Team" },
	Transfer_Team_Leader: { id: null, name: "Transfer Team Leader" },
};

const notificationTypeMapping = {
	"Leave Team": "Leave_Team",
	"Transfer Team Leader": "Transfer_Team_Leader",
};

export async function loadNotificationTypeMap() {
	const notificationType = await prisma.notificationType.findMany();
	console.log(notificationType);

	notificationType.forEach((type) => {
		const mappedNotificationType =
			notificationTypeMapping[type.typeOfNotification] ||
			type.typeOfNotification;

		if (NotificationTypeMap[mappedNotificationType]) {
			NotificationTypeMap[mappedNotificationType].id = type.id;
		}
	});
}

export type NotificationType = keyof typeof NotificationTypeMap;
