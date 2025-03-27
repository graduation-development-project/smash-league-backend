import { Match } from "@prisma/client";
import { ICreateMatch } from "../interfaces/tournament/match/match.interface";

export interface MatchRepositoryPort {
	getMatchDetail(matchId: string): Promise<Match>;
	createMatch(): Promise<any>;
	createMultipleMatch(createMatches: ICreateMatch[]): Promise<Match[]>;
	getMatchesOfStage(stageId: string): Promise<Match[]>;
	updateMatch(): Promise<any>;
}