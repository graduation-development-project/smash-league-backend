import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { StaffsRepositoryPort } from "../../domain/repositories/staffs.repository.port";
import { PrismaService } from "../services/prisma.service";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { NotificationTypeMap } from "../enums/notification-type.enum";
import { ReasonType, UserVerification } from "@prisma/client";
import { RoleMap } from "../enums/role.enum";

@Injectable()
export class PrismaStaffsRepositoryAdapter implements StaffsRepositoryPort {
	constructor(
		private prismaService: PrismaService,
		@InjectQueue("notificationQueue") private notificationQueue: Queue,
	) {}

	async verifyUserInformation(
		verificationID: string,
		option: boolean,
		rejectionReason?: string,
	): Promise<string> {
		const verificationExisted =
			await this.prismaService.userVerification.findUnique({
				where: { id: verificationID },
			});
		if (!verificationExisted) {
			throw new NotFoundException("Verification record not found");
		}

		await this.prismaService.$transaction(async (prisma) => {
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
				await prisma.reason.create({
					data: {
						reason: rejectionReason || "No reason provided",
						type: ReasonType.USER_VERIFICATION_REJECTION,
						userVerificationId: verificationID,
					},
				});
			}

			const notification = await prisma.notification.create({
				data: {
					message: option
						? "Your role registration has been approved"
						: "Your role registration has been rejected",
					typeId: option
						? NotificationTypeMap.Approve.id
						: NotificationTypeMap.Reject.id,
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
	}

	async getAllVerificationRequest(): Promise<UserVerification[]> {
		try {
			const verificationData =
				await this.prismaService.userVerification.findMany({
					include: {
						user: {
							select: {
								name: true,
							},
						},
					},
				});

			return verificationData.map((verification) => {
				let roleName = "";

				if (verification.role) {
					const foundRole = Object.values(RoleMap).find(
						(role) => role.id === verification.role,
					);
					if (foundRole) {
						roleName = foundRole.name;
					}
				}
				return {
					...verification,
					role: roleName,
				};
			});
		} catch (e) {
			console.error("Get all Verification request failed", e);
			throw e;
		}
	}
}
