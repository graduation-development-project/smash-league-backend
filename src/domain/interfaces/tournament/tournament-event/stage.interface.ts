import { ITournamentEventDetailResponse } from "./tournament-event.interface";

export interface ICreateStage {
	stageName: string;
	tournamentEventId: string;
}

export interface IStageResponse {
	id: string;
	stageName: string;
	tournamentEvent: ITournamentEventDetailResponse;
}