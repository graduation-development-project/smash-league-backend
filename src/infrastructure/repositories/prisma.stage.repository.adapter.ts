import { Inject, Injectable } from "@nestjs/common";
import { Stage, Match, PrismaClient } from "@prisma/client";
import { create } from "domain";
import { ICreateStage, IStageResponse } from "src/domain/interfaces/tournament/tournament-event/stage.interface";
import { StageRepositoryPort } from "src/domain/repositories/stage.repository.port";
import { StageOfMatch } from "../enums/tournament/tournament-match.enum";

@Injectable()
export class PrismaStageRepositoryAdapTer implements StageRepositoryPort {
	constructor(
		private readonly prisma: PrismaClient
	){
	}
	async getThirdPlaceStageOfTournamentEvent(tournamentEventId: string): Promise<Stage> {
		return await this.prisma.stage.findFirst({
			where: {
				tournamentEventId: tournamentEventId,
				stageName: StageOfMatch.ThirdPlaceMatch
			}
		});
	}
	async getStageById(stageId: string): Promise<Stage> {
		return await this.prisma.stage.findUnique({
			where: {
				id: stageId
			}
		});
	}

	
	async getStagesOfTournamentEvent(tournamentEventId: string): Promise<Stage[]> {
		return await this.prisma.stage.findMany({
			where: {
				tournamentEventId: tournamentEventId
			}
		});
	}
	async createStage(createStage: ICreateStage): Promise<Stage> {
		return await this.prisma.stage.create({
			data: {
				...createStage
			}
		});
	}
	async getMatchesOfStage(stageId: string): Promise<IStageResponse> {
		return await this.prisma.stage.findUnique({
			where: {
				id: stageId
			},
			select: {
				id: true,
				stageName: true,
				tournamentEvent: {
					select: {
						id: true,
						typeOfFormat: true,
						tournamentEvent: true,
						fromAge: true,
						toAge: true,
					}
				},
				matches: {
					select: {
						matchStatus: true,
						games: true,
					}
				}
			}
		});
	}

}