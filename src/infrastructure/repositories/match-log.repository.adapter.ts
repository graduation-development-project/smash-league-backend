import { MatchLog, PrismaClient } from "@prisma/client";
import { ICreateLogEvent } from "src/domain/interfaces/tournament/match/log-event.interface";
import { MatchLogRepositoryPort } from "src/domain/repositories/match-log.repository.port";

export class PrismaMatchLogRepositoryAdapter implements MatchLogRepositoryPort {
	constructor(
		private readonly prismaClient: PrismaClient
	) {
	}
	getAllMatchLogOfGames(gameId: string): Promise<MatchLog[]> {
		throw new Error("Method not implemented.");
	}
	getAllMatchLogOfMatch(matchId: string): Promise<MatchLog[]> {
		throw new Error("Method not implemented.");
	}
	createEventLogForGame(createLogEvent: ICreateLogEvent): Promise<MatchLog> {
		throw new Error("Method not implemented.");
	}
	deleteEventLogForGame(matchLogId: string): Promise<MatchLog> {
		throw new Error("Method not implemented.");
	}
}