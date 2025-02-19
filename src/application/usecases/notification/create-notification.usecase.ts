import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersRepositoryPort } from "../../../domain/repositories/users.repository.port";
import { Notification, User } from "@prisma/client";
import { CreateUserDTO } from "../../../domain/dtos/users/create-user.dto";
import { ChangePasswordDTO } from "../../../domain/dtos/users/change-password.dto";
import { TUserWithRole } from "../../../infrastructure/types/users.type";
import { NotificationsRepositoryPort } from "../../../domain/repositories/notifications.repository.port";
import {CreateNotificationDTO} from "../../../domain/dtos/notifications/create-notification.dto";

@Injectable()
export class CreateNotificationUseCase {
    constructor(
        @Inject("NotificationRepository")
        private notificationRepository: NotificationsRepositoryPort,
    ) {}

    async execute(createNotificationDTO: CreateNotificationDTO, receiverList: string[]): Promise<string> {
        return this.notificationRepository.createNotification(createNotificationDTO, receiverList);
    }
}
