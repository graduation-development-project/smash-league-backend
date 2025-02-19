import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
} from "@nestjs/common";
import { GetNotificationByUserUseCase } from "../../application/usecases/notification/get-notification-by-user.usecase";
import { Notification } from "@prisma/client";
import { CreateNotificationUseCase } from "../../application/usecases/notification/create-notification.usecase";
import { CreateNotificationDTO } from "../../domain/dtos/notifications/create-notification.dto";
import { IRequestUser } from "../interfaces/interfaces";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";

@Controller("/notifications")
export class NotificationController {
	constructor(
		private getNotificationByUserUseCase: GetNotificationByUserUseCase,
		private createNotificationUseCase: CreateNotificationUseCase,
	) {}

	@Get("/user")
	@UseGuards(JwtAccessTokenGuard)
	getNotificationsByUser(
		@Req() { user }: IRequestUser,
	): Promise<Notification[]> {
		return this.getNotificationByUserUseCase.execute(user.id);
	}

	@Post("/")
	createNotification(
		@Body() createNotificationDTO: CreateNotificationDTO,
		@Body("receiverList") receiverList: string[],
	): Promise<string> {
		return this.createNotificationUseCase.execute(
			createNotificationDTO,
			receiverList,
		);
	}
}
