import { Match, Stage, TournamentEvent } from "@prisma/client";

export interface StageRepositoryPort {
	getStagesOfTournamentEvent(tournamentEventId: string): Promise<Stage[]>;
	createStage(): Promise<Stage>;
	getMatchesOfStage(stageId: string): Promise<Match[]>;
}