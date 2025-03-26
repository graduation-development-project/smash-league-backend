import { Match } from "@prisma/client";

export interface MatchRepositoryPort {
	getMatchDetail(matchId: string): Promise<Match>;
	createMatch(): Promise<any>;
	createMultipleMatch(): Promise<any>;
	getMatchesOfStage(stageId: string): Promise<Match[]>;
	updateMatch(): Promise<any>;
}