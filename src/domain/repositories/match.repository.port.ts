import { Game, Match, Prisma, TournamentEvent } from "@prisma/client";
import {
	ICreateMatch,
	IMatchDetailBracketResponse,
} from "../interfaces/tournament/match/match.interface";
import { IMatchQueryResponse } from "../interfaces/tournament/match/match.query";
import { IGameAfterUpdatePointResponse } from "../interfaces/tournament/match/game.interface";
import { UpdateMatchDTO } from "../dtos/match/update-match.dto";

export interface MatchRepositoryPort {
	undoUpdatePoint(gameId: string): Promise<Game>;

	getMatchDetail(matchId: string): Promise<Match>;

	getMatchDetailById(matchId: string): Promise<IMatchQueryResponse>;

	createMatch(match: Prisma.MatchCreateManyInput): Promise<any>;

	createMultipleMatch(createMatches: ICreateMatch[]): Promise<Match[]>;

	getMatchesOfStage(stageId: string): Promise<Match[]>;

	getAllMatchesOfTournamentEvent(tournamentEventId: string): Promise<any[]>;
	getBracketOfTournamentEvent(tournamentEventId: string): Promise<any[]>;

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

	skipMatchesExceptFirstAndFinal(eventId: string): Promise<void>;

	assignPlayersToFirstRoundMatches(tournamentEventId: string): Promise<void>;

	countMatchesStatusByOrganizerId(
		organizerId: string,
	): Promise<Record<string, number>>;

	countNumberOfMatchesInCurrentWeek(organizerId: string): Promise<{
		currentCount: number;
		previousCount: number;
		changeRate: number;
	}>;

	updateByeMatch(matchId: string, isByeMatch: boolean): Promise<Match>;
	updateMatchWinner(matchId: string, winningCompetitorId: string): Promise<Match>;
	getMatchesPrevious(matchId: string): Promise<Match[]>;
	updateMatchEnd(matchId: string): Promise<Match>;
	processNextMatchToByeMatch(nextMatchId: string): Promise<boolean>;
}
