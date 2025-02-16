import { Injectable } from "@nestjs/common";
import { PrismaClient, UserVerification } from "@prisma/client";
import { StaffsRepositoryPort } from "../../domain/repositories/staffs.repository.port";

@Injectable()
export class PrismaStaffsRepositoryAdapter implements StaffsRepositoryPort {
	constructor(private prisma: PrismaClient) {}

	async verifyUserInformation(
		verificationID: string,
		option: boolean,
	): Promise<string> {
		try {
			const verificationExisted: UserVerification =
				await this.prisma.userVerification.findUnique({
					where: { id: verificationID },
				});

			if (!verificationExisted) {
				throw new Error("Verification record not found");
			}

			await this.prisma.$transaction(async (prisma) => {
				const updatedVerification = await prisma.userVerification.update({
					where: { id: verificationID },
					data: { isVerified: option },
				});

				if (option) {
					await prisma.userRole.create({
						data: {
							userId: updatedVerification.userId,
							roleId: updatedVerification.role,
						},
					});
				}
			});

			return option ? "Approve Successfully" : "Reject Successfully";
		} catch (e) {
			throw e;
		}
	}
}
