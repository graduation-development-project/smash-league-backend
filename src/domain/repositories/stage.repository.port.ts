import { Match, Stage, TournamentEvent } from "@prisma/client";
import { ICreateStage, IStageResponse } from "../interfaces/tournament/tournament-event/stage.interface";

export interface StageRepositoryPort {
	getStagesOfTournamentEvent(tournamentEventId: string): Promise<Stage[]>;
	createStage(createStage: ICreateStage): Promise<Stage>;
	getMatchesOfStage(stageId: string): Promise<IStageResponse>;
	getStageById(stageId: string): Promise<Stage>;
	getThirdPlaceStageOfTournamentEvent(tournamentEventId: string): Promise<Stage>;
} 