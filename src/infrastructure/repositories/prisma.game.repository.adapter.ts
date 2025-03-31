import { Game, PrismaClient } from "@prisma/client";
import { GameRepositoryPort } from "src/domain/repositories/game.repository.port";

export class PrismaGameRepositoryAdapter implements GameRepositoryPort {
	constructor(
		private readonly prisma: PrismaClient
	) {
	}
	async createNewGame(matchId: string, gameNumber: number, currentServerId: string): Promise<Game> {
		return await this.prisma.game.create({
			data: {
				gameNumber: gameNumber,
				currentServerId: currentServerId,
				leftCompetitorPoint: 0,
				rightCompetitorPoint: 0,
				matchId: matchId
			}
		});
	}
	async getGame(gameId: string): Promise<Game> {
		throw new Error("Method not implemented.");
	}
	getGamesOfMatch(matchId: string): Promise<Game[]> {
		throw new Error("Method not implemented.");
	}
}