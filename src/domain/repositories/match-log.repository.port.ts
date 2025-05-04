import { MatchLog } from "@prisma/client";
import { ICreateLogEvent } from "../interfaces/tournament/match/log-event.interface";

export interface MatchLogRepositoryPort {
	getAllMatchLogOfGames(gameId: string): Promise<MatchLog[]>;
	getAllMatchLogOfMatch(matchId: string): Promise<MatchLog[]>;
	createEventLogForGame(createLogEvent: ICreateLogEvent): Promise<MatchLog>;
	deleteEventLogForGame(matchLogId: string): Promise<MatchLog>;
	setMatchInterval(createLogEvent: ICreateLogEvent): Promise<MatchLog>;
}