import { BadRequestException, Injectable } from "@nestjs/common";
import { Notification, UserVerification } from "@prisma/client";
import { StaffsRepositoryPort } from "../../domain/repositories/staffs.repository.port";
import { PrismaService } from "../services/prisma.service";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class PrismaStaffsRepositoryAdapter implements StaffsRepositoryPort {
	constructor(
		private prisma: PrismaService,
		@InjectQueue("notificationQueue") private notificationQueue: Queue,
	) {}

	async verifyUserInformation(
		verificationID: string,
		option: boolean,
		rejectionReason?: string,
	): Promise<string> {
		try {
			// Check if verification exists
			const verificationExisted: UserVerification =
				await this.prisma.userVerification.findUnique({
					where: { id: verificationID },
				});
			if (!verificationExisted) {
				throw new Error("Verification record not found");
			}

			await this.prisma.$transaction(async (prisma) => {
				await prisma.userVerification.update({
					where: { id: verificationID },
					data: { isVerified: option },
				});

				if (option) {
					await prisma.userRole.create({
						data: {
							userId: verificationExisted.userId,
							roleId: verificationExisted.role,
						},
					});
				} else {
					await prisma.rejection.create({
						data: {
							reason: rejectionReason || "No reason provided",
							type: "1",
							userVerificationId: verificationID,
						},
					});
				}

				const notification: Notification = await prisma.notification.create({
					data: {
						message: option
							? "Your role registration has been approved"
							: "Your role registration has been rejected",
						typeId: "1",
						title: option
							? "Your role registration has been approved"
							: "Your role registration has been rejected",
					},
				});

				if (!notification) {
					throw new BadRequestException("Failed to create notification");
				}

				await this.notificationQueue.add(
					"sendNotification",
					{
						userId: verificationExisted.userId,
						notificationId: notification.id,
					},
					{
						removeOnComplete: true,
						attempts: 3,
					},
				);
			});

			return option ? "Approve Successfully" : "Reject Successfully";
		} catch (e) {
			throw e;
		}
	}
}
