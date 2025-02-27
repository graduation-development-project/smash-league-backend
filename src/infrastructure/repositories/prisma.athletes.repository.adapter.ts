import { BadRequestException, Injectable } from "@nestjs/common";
import {
	InvitationStatus,
	TeamInvitation,
	Tournament,
	TournamentRegistration,
	UserRole,
	UserVerification,
} from "@prisma/client";
import { AthletesRepositoryPort } from "../../domain/repositories/athletes.repository.port";
import { RegisterTournamentDTO } from "../../domain/dtos/athletes/register-tournament.dto";
import { EventTypesEnum } from "../enums/event-types.enum";
import { RegisterNewRoleDTO } from "../../domain/dtos/athletes/register-new-role.dto";
import { TCloudinaryResponse } from "../types/cloudinary.type";
import { v2 as cloudinary } from "cloudinary";
import { PrismaService } from "../services/prisma.service";
import { TournamentStatusEnum } from "../enums/tournament-status.enum";
import { UploadService } from "../services/upload.service";
import { ResponseToTeamInvitationDTO } from "../../domain/dtos/athletes/response-to-team-invitation.dto";
import { NotificationTypeMap } from "../enums/notification-type.enum";

const streamifier = require("streamifier");

@Injectable()
export class PrismaAthletesRepositoryAdapter implements AthletesRepositoryPort {
	constructor(
		private prisma: PrismaService,
		private uploadService: UploadService,
	) {}

	async registerTournament(
		registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentRegistration> {
		// try {
		// 	const { tournamentId, partnerId, userId, tournamentDisciplineId } =
		// 		registerTournamentDTO;

		// 	// const tournamentExisted = await this.prisma.tournament.findUnique({
		// 	// 	where: { id: tournamentId },
		// 	// });

		// 	// if (!tournamentExisted) {
		// 	// 	throw new BadRequestException("Tournament not found");
		// 	// }

		// 	const userRegistered: TournamentParticipant =
		// 		await this.prisma.tournamentParticipant.findFirst({
		// 			where: {
		// 				tournamentId,
		// 				OR: [
		// 					{ userId, eventType }, // * User registered as a player
		// 					{ partnerId: userId }, // * User is registered as a partner
		// 				],
		// 			},
		// 		});

		// 	// if (userRegistered) {
		// 	// 	throw new BadRequestException(
		// 	// 		"User already registered this tournament event type",
		// 	// 	);
		// 	// }

		// 	// // * Check if partner is registered
		// 	// if (tournamentDisciplineId.toUpperCase() === EventTypesEnum.DOUBLE.toUpperCase()) {
		// 	// 	const partnerRegistered: TournamentRegistration =
		// 	// 		await this.prisma.tournamentRegistration.findFirst({
		// 	// 			where: {
		// 	// 				tournamentId,
		// 	// 				OR: [
		// 	// 					{ userId: partnerId, tournamentDisciplineId: eventType },
		// 	// 					{ partnerId },
		// 	// 				],
		// 	// 			},
		// 	// 		});

		// 	// 	if (partnerRegistered) {
		// 	// 		throw new BadRequestException(
		// 	// 			"Your partner already registered this tournament event type",
		// 	// 		);
		// 	// 	}
		// 	// }

		// 	// return await this.prisma.tournamentRegistration.create({
		// 	// 	data: {
		// 	// 		tournamentId,
		// 	// 		userId,
		// 	// 		tournamentDisciplineId: eventType,
		// 	// 		partnerId:
		// 	// 			eventType.toUpperCase() === EventTypesEnum.DOUBLE.toUpperCase()
		// 	// 				? partnerId || null
		// 	// 				: null,
		// 	// 	},
		// 	// });
		// // } catch (e) {
		// // 	throw e;
		// // }
		return null;
	}

	async getParticipatedTournaments(
		userID: string,
		tournamentStatus: string,
	): Promise<Tournament[]> {
		try {
			return this.prisma.tournament.findMany({
				where: {
					registrations: {
						some: {
							OR: [
								{ userId: userID }, //* User participated as a player
								{ partnerId: userID }, //* User participated as a partner
							],
						},
					},

					...(tournamentStatus
						? { status: TournamentStatusEnum[tournamentStatus] }
						: {}),
				},
			});
		} catch (e) {
			throw e;
		}
	}

	// async uploadVerificationImage(
	// 	files: Express.Multer.File[],
	// 	userID: string,
	// ): Promise<TCloudinaryResponse[]> {
	// 	try {
	// 		const now = new Date();
	// 		const folderName = `verification-information/${now.toISOString().split("T")[0]}/${userID}`;
	//
	// 		const uploadPromises: Promise<TCloudinaryResponse>[] = files.map(
	// 			(file) => {
	// 				return new Promise<TCloudinaryResponse>((resolve, reject) => {
	// 					const uploadStream = cloudinary.uploader.upload_stream(
	// 						{
	// 							resource_type: "auto",
	// 							folder: folderName, //* Specify the folder name
	// 							public_id: `${userID}-${now.toISOString()}`, //* Unique file name
	// 						},
	//
	// 						(error, result) => {
	// 							if (error) return reject(error);
	// 							resolve(result);
	// 						},
	// 					);
	//
	// 					streamifier.createReadStream(file.buffer).pipe(uploadStream);
	// 				});
	// 			},
	// 		);
	//
	// 		return Promise.all(uploadPromises);
	// 	} catch (e) {
	// 		throw e;
	// 	}
	// }

	async registerNewRole(
		registerNewRoleDTO: RegisterNewRoleDTO,
	): Promise<UserVerification> {
		try {
			console.log(registerNewRoleDTO);
			const { files, role, userId } = registerNewRoleDTO;

			const roleExisted: UserRole = await this.prisma.userRole.findUnique({
				where: {
					userId_roleId: {
						userId,
						roleId: role,
					},
				},
			});

			if (roleExisted) {
				throw new BadRequestException("This role is already registered");
			}

			const verificationExisted = await this.prisma.userVerification.findFirst({
				where: {
					userId,
					role,
				},
			});

			if (verificationExisted) {
				throw new BadRequestException("You already registered this role");
			}

			const folderName = `verification-information/${new Date().toISOString().split("T")[0]}/${userId}`;

			const imageUrls = await this.uploadService.uploadFiles(
				files,
				folderName,
				userId,
			);

			console.log(imageUrls);

			if (!imageUrls) {
				throw new BadRequestException("Upload images fail");
			}

			return this.prisma.userVerification.create({
				data: {
					userId,
					role,
					IDCardFront: imageUrls[0].secure_url,
					IDCardBack: imageUrls[1].secure_url,
					cardPhoto: imageUrls[2].secure_url,
					createdAt: new Date(),
				},
			});
		} catch (e) {
			throw e;
		}
	}

	async responseToTeamInvitation(
		responseToTeamInvitationDTO: ResponseToTeamInvitationDTO,
	): Promise<string> {
		const { invitationId, option, invitedUserId } = responseToTeamInvitationDTO;

		try {
			const existedInvitation = await this.prisma.teamInvitation.findUnique({
				where: {
					id: invitationId,
					status: InvitationStatus.PENDING,
					invitedUserId,
				},

				include: {
					invitedUser: true,
					team: true,
				},
			});

			if (!existedInvitation) {
				throw new BadRequestException("This invitation does not exist");
			}

			let athleteName: string = `${existedInvitation.invitedUser.firstName} ${existedInvitation.invitedUser.lastName}`;

			await this.prisma.$transaction(async (prisma) => {
				await prisma.teamInvitation.update({
					where: { id: invitationId },
					data: {
						status: option
							? InvitationStatus.ACCEPTED
							: InvitationStatus.REJECTED,
					},
				});

				if (option) {
					await prisma.userTeam.create({
						data: {
							userId: existedInvitation.invitedUserId,
							teamId: existedInvitation.teamId,
						},
					});
				}

				const createdNotification = await prisma.notification.create({
					data: {
						title: option ? "Accept join team" : "Reject join team",
						message: `${athleteName} ${option ? "accepted your invitation" : "rejected your invitation"}`,
						typeId: NotificationTypeMap.Reject.id,
					},
				});

				await prisma.userNotification.create({
					data: {
						notificationId: createdNotification.id,
						userId: existedInvitation.team.teamLeaderId,
					},
				});
			});

			return option ? "Accept Successfully" : "Reject Successfully";
		} catch (e) {
			console.error("Response to invitation failed", e);
			throw e;
		}
	}
}
