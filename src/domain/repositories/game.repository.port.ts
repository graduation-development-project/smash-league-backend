import { Game } from "@prisma/client";

export interface GameRepositoryPort {
	createNewGame(matchId: string, gameNumber: number, currentServerId: string): Promise<Game>;
	getGame(gameId: string): Promise<Game>;
	getGamesOfMatch(matchId: string): Promise<Game[]>;
}