import { Game, Match, TournamentEvent } from "@prisma/client";
import {
	ICreateMatch,
	IMatchDetailBracketResponse,
} from "../interfaces/tournament/match/match.interface";
import { IMatchQueryResponse } from "../interfaces/tournament/match/match.query";
import { IGameAfterUpdatePointResponse } from "../interfaces/tournament/match/game.interface";
import { UpdateMatchDTO } from "../dtos/match/update-match.dto";

export interface MatchRepositoryPort {
	getMatchDetail(matchId: string): Promise<Match>;

	getMatchDetailById(matchId: string): Promise<IMatchQueryResponse>;

	createMatch(): Promise<any>;

	createMultipleMatch(createMatches: ICreateMatch[]): Promise<Match[]>;

	getMatchesOfStage(stageId: string): Promise<Match[]>;

	getAllMatchesOfTournamentEvent(tournamentEventId: string): Promise<any[]>;

	updateMatch(matchId: string, updateMatchDTO: UpdateMatchDTO): Promise<any>;

	updateAttendance(
		matchId: string,
		leftCompetitorAttendance: boolean,
		rightCompetitorAttendance: boolean,
	): Promise<Match>;

	updateForfeitCompetitor(
		matchId: string,
		forfeitCompetitorId: string,
	): Promise<any>;

	updateStartTimeForMatch(
		matchId: string,
		currentServerId: string,
	): Promise<Game>;

	updatePoint(
		gameId: string,
		winningId: string,
	): Promise<IGameAfterUpdatePointResponse>;

	assignCourtForMatch(matchId: string, courtId: string): Promise<Match>;

	assignAthleteIntoMatch(
		matchId: string,
		leftCompetitorId: string,
		rightCompetitorId: string,
	): Promise<Match>;

	countMatchesOfLastStage(matchId: string): Promise<number>;

	getMatchesOfUser(userId: string): Promise<Match[]>;

	getLatestMatchesOfUser(userId: string): Promise<Match[]>;

	continueMatch(matchId: string): Promise<Match>;
}
