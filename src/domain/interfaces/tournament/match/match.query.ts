import { IParticipantResponse } from "./competitor.interface";

export interface IMatchQueryResponse {
	id: string;
	matchNumber: number;
	leftCompetitor: IParticipantResponse;
	rightCompetitor: IParticipantResponse;
	startedWhen: Date;
	stage: IStageQueryResponse;
	nextMatchId: string;
	umpire: IUmpireQueryResponse;
}

export interface IStageQueryResponse {
	id: string;
	stageName: string;
}

export interface IUmpireQueryResponse {
	id: string;
	name: string;
}