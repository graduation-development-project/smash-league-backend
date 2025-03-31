import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersRepositoryPort } from "../../../domain/interfaces/repositories/users.repository.port";
import { Notification, User } from "@prisma/client";
import { CreateUserDTO } from "../../../domain/dtos/users/create-user.dto";
import { ChangePasswordDTO } from "../../../domain/dtos/users/change-password.dto";
import { TUserWithRole } from "../../../infrastructure/types/users.type";
import { NotificationsRepositoryPort } from "../../../domain/interfaces/repositories/notifications.repository.port";

@Injectable()
export class GetNotificationByUserUseCase {
	constructor(
		@Inject("NotificationRepository")
		private notificationRepository: NotificationsRepositoryPort,
	) {}

	async execute(userID: string): Promise<Notification[]> {
		return this.notificationRepository.getNotificationsByUserID(userID);
	}
}
