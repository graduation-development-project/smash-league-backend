import * as bcrypt from "bcryptjs";
import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { PrismaClient, TournamentParticipant, User } from "@prisma/client";
import { UsersRepositoryPort } from "../../domain/repositories/users.repository.port";
import { CreateUserDTO } from "../dto/users/create-user.dto";
import { TUserWithRole } from "../types/users.type";
import { EditUserDTO } from "../dto/users/edit-user.dto";
import { AthletesRepository } from "../../domain/repositories/athletes.repository";
import { RegisterTournamentDTO } from "../dto/athletes/register-tournament.dto";

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

			const userRegistered = await this.prisma.tournamentParticipant.findUnique(
				{
					where: {
						tournamentId_userId: {
							userId,
							tournamentId,
						},
					},
				},
			);

			if (userRegistered) {
				throw new BadRequestException(
					"User already registered this tournament",
				);
			}

			const registerStatus: TournamentParticipant =
				await this.prisma.tournamentParticipant.create({
					data: {
						tournamentId,
						userId,
						eventType,
						partnerId: eventType === "Double" ? partnerId || null : null,
					},
				});

			return registerStatus;
		} catch (e) {
			throw e;
		}
	}
}
