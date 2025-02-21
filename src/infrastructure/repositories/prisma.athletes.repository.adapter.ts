import { BadRequestException, Injectable } from "@nestjs/common";
import {
	Tournament,
	TournamentParticipant,
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

const streamifier = require("streamifier");

@Injectable()
export class PrismaAthletesRepositoryAdapter implements AthletesRepositoryPort {
	constructor(private prisma: PrismaService) {}

	async registerTournament(
		registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentParticipant> {
		try {
			const { tournamentId, partnerId, userId, tournamentDisciplineId } =
				registerTournamentDTO;

			// const tournamentExisted = await this.prisma.tournament.findUnique({
			// 	where: { id: tournamentId },
			// });

			// if (!tournamentExisted) {
			// 	throw new BadRequestException("Tournament not found");
			// }

			const userRegistered: TournamentParticipant =
				await this.prisma.tournamentParticipant.findFirst({
					where: {
						tournamentId,
						OR: [
							{ userId, tournamentDisciplineId }, // * User registered as a player
							{ partnerId: userId }, // * User is registered as a partner
						],
					},
				});

			// if (userRegistered) {
			// 	throw new BadRequestException(
			// 		"User already registered this tournament event type",
			// 	);
			// }

			// * Check if partner is registered
			if (eventType.toUpperCase() === EventTypesEnum.DOUBLE.toUpperCase()) {
				const partnerRegistered: TournamentRegistration =
					await this.prisma.tournamentRegistration.findFirst({
						where: {
							tournamentId,
							OR: [{ userId: partnerId, eventType }, { partnerId }],
						},
					});

			// 	if (partnerRegistered) {
			// 		throw new BadRequestException(
			// 			"Your partner already registered this tournament event type",
			// 		);
			// 	}
			// }

			return await this.prisma.tournamentRegistration.create({
				data: {
					tournamentId,
					userId,
					eventType,
					partnerId:
						eventType.toUpperCase() === EventTypesEnum.DOUBLE.toUpperCase()
							? partnerId || null
							: null,
				},
			});
		} catch (e) {
			throw e;
		}
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

	async uploadVerificationImage(
		files: Express.Multer.File[],
		userID: string,
	): Promise<TCloudinaryResponse[]> {
		try {
			const now = new Date();
			const folderName = `verification-information/${now.toISOString().split("T")[0]}/${userID}`;

			const uploadPromises: Promise<TCloudinaryResponse>[] = files.map(
				(file) => {
					return new Promise<TCloudinaryResponse>((resolve, reject) => {
						const uploadStream = cloudinary.uploader.upload_stream(
							{
								resource_type: "auto",
								folder: folderName, //* Specify the folder name
								public_id: `${userID}-${now.toISOString()}`, //* Unique file name
							},

							(error, result) => {
								if (error) return reject(error);
								resolve(result);
							},
						);

						streamifier.createReadStream(file.buffer).pipe(uploadStream);
					});
				},
			);

			return Promise.all(uploadPromises);
		} catch (e) {
			throw e;
		}
	}

	async registerNewRole(
		userID: string,
		registerNewRoleDTO: RegisterNewRoleDTO,
	): Promise<UserVerification> {
		try {
			const { IDCardFront, IDCardBack, role, cardPhoto } = registerNewRoleDTO;

			const roleExisted: UserRole = await this.prisma.userRole.findUnique({
				where: {
					userId_roleId: {
						userId: userID,
						roleId: role,
					},
				},
			});

			if (roleExisted) {
				throw new BadRequestException("This role is already registered");
			}

			const verificationExisted = await this.prisma.userVerification.findFirst({
				where: {
					userId: userID,
					role,
				},
			});

			if (verificationExisted) {
				throw new BadRequestException("You already registered this role");
			}

			return this.prisma.userVerification.create({
				data: {
					userId: userID,
					role,
					cardPhoto,
					IDCardBack,
					IDCardFront,
					createdAt: new Date(),
				},
			});
		} catch (e) {
			throw e;
		}
	}
}
