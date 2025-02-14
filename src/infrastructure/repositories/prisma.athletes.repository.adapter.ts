import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaClient, TournamentParticipant } from "@prisma/client";
import { AthletesRepository } from "../../domain/repositories/athletes.repository";
import { RegisterTournamentDTO } from "../dto/athletes/register-tournament.dto";
import { EventTypesEnum } from "../enums/event-types.enum";

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
}
