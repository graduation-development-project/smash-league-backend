import { TournamentUmpireRepositoryPort } from "../../domain/repositories/tournament-umpire.repository.port";
import { PrismaService } from "../services/prisma.service";
import { TournamentUmpires } from "@prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaTournamentUmpireRepositoryAdapter
	implements TournamentUmpireRepositoryPort
{
	constructor(private prismaService: PrismaService) {}

	async createTournamentUmpire(
		tournamentId: string,
		userId: string,
	): Promise<TournamentUmpires> {
		try {
			return this.prismaService.tournamentUmpires.create({
				data: {
					tournamentId,
					userId,
				},
			});
		} catch (e) {
			console.error("createTournamentUmpire failed", e);
			throw e;
		}
	}

	async getTournamentUmpiresList(tournamentId: string): Promise<TournamentUmpires[]> {
		try {
			return this.prismaService.tournamentUmpires.findMany({
				where: {
					tournamentId,
				},
			});
		} catch (e) {
			console.error("createTournamentUmpire failed", e);
			throw e;
		}
	}
}
