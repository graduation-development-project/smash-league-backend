import { BadRequestException, Injectable } from "@nestjs/common";
import {
	PrismaClient,
	Tournament,
	TournamentParticipant,
	User,
	UserVerification,
} from "@prisma/client";
import { AthletesRepository } from "../../domain/repositories/athletes.repository";
import { RegisterTournamentDTO } from "../dto/athletes/register-tournament.dto";
import { EventTypesEnum } from "../enums/event-types.enum";
import { RegisterNewRoleDTO } from "../dto/athletes/register-new-role.dto";
import { TUserWithRole } from "../types/users.type";
import { TCloudinaryResponse } from "../types/cloudinary.type";
import { v2 as cloudinary } from "cloudinary";

const streamifier = require("streamifier");

@Injectable()
export class PrismaAthletesRepositoryAdapter implements AthletesRepository {
	constructor(private prisma: PrismaClient) {}

	async registerTournament(
		registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentParticipant> {
		try {
			const { tournamentId, partnerId, userId, eventType } =
				registerTournamentDTO;

			const tournamentExisted = await this.prisma.tournament.findUnique({
				where: { id: tournamentId },
			});

			if (!tournamentExisted) {
				throw new BadRequestException("Tournament not found");
			}

			const userRegistered: TournamentParticipant =
				await this.prisma.tournamentParticipant.findFirst({
					where: {
						tournamentId,
						OR: [
							{ userId, eventType }, // * User registered as a player
							{ partnerId: userId }, // * User is registered as a partner
						],
					},
				});

			// * Check if partner is registered
			if (eventType.toUpperCase() === EventTypesEnum.DOUBLE.toUpperCase()) {
				const partnerRegistered: TournamentParticipant =
					await this.prisma.tournamentParticipant.findFirst({
						where: {
							tournamentId,
							OR: [{ userId: partnerId, eventType }, { partnerId }],
						},
					});

				if (partnerRegistered) {
					throw new BadRequestException(
						"Your partner already registered this tournament event type",
					);
				}
			}

			if (userRegistered) {
				throw new BadRequestException(
					"User already registered this tournament event type",
				);
			}

			return await this.prisma.tournamentParticipant.create({
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
					participants: {
						some: {
							OR: [
								{ userId: userID }, //* User participated as a player
								{ partnerId: userID }, //* User participated as a partner
							],
						},
					},

					...(tournamentStatus ? { status: tournamentStatus } : {}),
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
