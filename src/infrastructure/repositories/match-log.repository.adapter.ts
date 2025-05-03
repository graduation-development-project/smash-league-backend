import { Injectable } from "@nestjs/common";
import { MatchLog, PrismaClient } from "@prisma/client";
import { ICreateLogEvent } from "src/domain/interfaces/tournament/match/log-event.interface";
import { MatchLogRepositoryPort } from "src/domain/repositories/match-log.repository.port";

@Injectable()
export class PrismaMatchLogRepositoryAdapter implements MatchLogRepositoryPort {
	constructor(
		private readonly prisma: PrismaClient
	) {
	}
	async getAllMatchLogOfGames(gameId: string): Promise<MatchLog[]> {
		return await this.prisma.matchLog.findMany({
			where: {
				gameId: gameId
			}
		});
	}
	async getAllMatchLogOfMatch(matchId: string): Promise<MatchLog[]> {
		const games = await this.prisma.game.findMany({
			where: {
				matchId: matchId
			}
		});
		var matchLogs: MatchLog[] = [];
		for (let i = 0; i < games.length; i++) {
			const logs = await this.prisma.matchLog.findMany({
				where: {
					gameId: games[i].id
				}
			});
			matchLogs.push(...logs);
		}
		return matchLogs;
	}
	async createEventLogForGame(createLogEvent: ICreateLogEvent): Promise<MatchLog> {
		return await this.prisma.matchLog.create({ 
			data: {
				...createLogEvent
			}
		});
	}
	async deleteEventLogForGame(matchLogId: string): Promise<MatchLog> {
		return await this.prisma.matchLog.delete({
			where: {
				id: matchLogId
			}
		});
	}
}