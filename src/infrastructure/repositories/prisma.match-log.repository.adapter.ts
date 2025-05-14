import { Injectable } from "@nestjs/common";
import { MatchLog, MatchStatus, PrismaClient } from "@prisma/client";
import { ICreateLogEvent } from "src/domain/interfaces/tournament/match/log-event.interface";
import { MatchLogRepositoryPort } from "src/domain/repositories/match-log.repository.port";

@Injectable()
export class PrismaMatchLogRepositoryAdapter implements MatchLogRepositoryPort {
	constructor(
		private readonly prisma: PrismaClient
	) {
	}
	async setMatchInterval(createLogEvent: ICreateLogEvent): Promise<MatchLog> {
		const gameOfMatch = await this.prisma.game.findUnique({
			where: {
				id: createLogEvent.gameId
			},
			select: {
				match: true
			}
		});
		const updatedMatch = await this.prisma.match.update({
			where: {
				id: gameOfMatch.match.id
			},
			data: {
				matchStatus: MatchStatus.INTERVAL,
			}
		});
		return await this.prisma.matchLog.create({
			data: {
				...createLogEvent
			}
		});
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