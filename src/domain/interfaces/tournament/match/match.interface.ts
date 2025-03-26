import { MatchStatus } from "@prisma/client";
import { ICompetitorResponse, IParticipantResponse } from "./competitor.interface";
export interface IMatchResponse {
	id: string;
	leftCompetitor: IParticipantResponse;
	rightCompetitor: IParticipantResponse;
	games: IGameResponse[];
}

export interface IGameResponse {
	leftTeamPoint: number;
	rightTeamPoint: number;
	currentServer: IParticipantResponse;
}

export interface ICreateMatch {
	matchStatus: MatchStatus;
	stageId: string;
	isByeMatch: boolean;
	nextMatchId: string;
}