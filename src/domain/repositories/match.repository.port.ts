import { Match, TournamentEvent } from "@prisma/client";
import { ICreateMatch, IMatchDetailBracketResponse } from "../interfaces/tournament/match/match.interface";

export interface MatchRepositoryPort {
	getMatchDetail(matchId: string): Promise<Match>;
	createMatch(): Promise<any>;
	createMultipleMatch(createMatches: ICreateMatch[]): Promise<Match[]>;
	getMatchesOfStage(stageId: string): Promise<Match[]>;
	getAllMatchesOfTournamentEvent(tournamentEventId: string): Promise<any[]>;
	updateMatch(): Promise<any>;
	updateAttendance(matchId: string, leftCompetitorAttendance: boolean, rightCompetitorAttendance: boolean): Promise<any>;
	updateForfeitCompetitor(matchId: string, forfeitCompetitorId: string): Promise<any>;
	updateStartTimeForMatch(matchId: string): Promise<Match>;
}