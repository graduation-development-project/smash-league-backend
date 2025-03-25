import { Inject, Injectable } from "@nestjs/common";
import { Stage, Match, PrismaClient } from "@prisma/client";
import { StageRepositoryPort } from "src/domain/repositories/stage.repository.port";

@Injectable()
export class PrismaStageRepositoryAdapTer implements StageRepositoryPort {
	constructor(
		private readonly prisma: PrismaClient
	){
	}
	async getStagesOfTournamentEvent(tournamentEventId: string): Promise<Stage[]> {
		return await this.prisma.stage.findMany({
			where: {
				
			}
		})
	}
	createStage(): Promise<Stage> {
		throw new Error("Method not implemented.");
	}
	getMatchesOfStage(stageId: string): Promise<Match[]> {
		throw new Error("Method not implemented.");
	}

}