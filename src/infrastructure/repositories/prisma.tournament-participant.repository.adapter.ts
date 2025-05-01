import { Injectable } from "@nestjs/common";

import { PrismaService } from "../services/prisma.service";
import { TournamentParticipantsRepositoryPort } from "../../domain/repositories/tournament-participant.repository.port";
import { TournamentParticipants } from "@prisma/client";

@Injectable()
export class PrismaTournamentParticipantRepositoryAdapter
	implements TournamentParticipantsRepositoryPort
{
	constructor(private prismaService: PrismaService) {}

	async addTournamentParticipant(
		tournamentId: string,
		tournamentEventId: string,
		playerId: string,
		partnerId?: string,
	): Promise<TournamentParticipants> {
		try {
			return this.prismaService.tournamentParticipants.create({
				data: {
					tournamentEventId,
					userId: playerId,
					tournamentId,
					partnerId,
				},
			});
		} catch (e) {
			console.error("Error adding tournament participant", e);
			throw e;
		}
	}

	async getParticipantInTournament(
		tournamentId: string,
		userId: string,
	): Promise<TournamentParticipants[]> {
		try {
			return this.prismaService.tournamentParticipants.findMany({
				where: {
					userId,
					tournamentId,
				},
			});
		} catch (e) {
			console.error("Error getParticipantInTournament", e);
			throw e;
		}
	}

	async getEventParticipantList(
		tournamentId: string,
		tournamentEventId: string,
	): Promise<TournamentParticipants[]> {
		try {
			return this.prismaService.tournamentParticipants.findMany({
				where: {
					tournamentId,
					tournamentEventId,
				},
			});
		} catch (e) {
			console.error("Error getParticipantInTournament", e);
			throw e;
		}
	}

	async getTournamentParticipantDetail(
		id: string,
	): Promise<TournamentParticipants> {
		try {
			return this.prismaService.tournamentParticipants.findUnique({
				where: { id },
			});
		} catch (e) {
			console.error("Error getTournamentParticipantDetail", e);
			throw e;
		}
	}
}
