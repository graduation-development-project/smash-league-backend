import { Injectable } from "@nestjs/common";
import { Match, PrismaClient } from "@prisma/client";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";

@Injectable()
export class PrismaMatchRepositoryAdapter implements MatchRepositoryPort {
	constructor(
		private readonly prisma: PrismaClient
	){
	}
	async createMultipleMatch(): Promise<any> {
		return;
	}
	async getMatchDetail(matchId: string): Promise<Match> {
		return await this.prisma.match.findUnique({
			where: {
				id: matchId
			}
		});
	}
	createMatch(): Promise<any> {
		throw new Error("Method not implemented.");
	}
	getMatchesOfStage(stageId: string): Promise<Match[]> {
		throw new Error("Method not implemented.");
	}
	updateMatch(): Promise<any> {
		throw new Error("Method not implemented.");
	}

	
}