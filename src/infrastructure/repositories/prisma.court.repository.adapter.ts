import { Injectable } from "@nestjs/common";
import { Court, Match, Prisma, PrismaClient } from "@prisma/client";
import { CourtRepositoryPort } from "src/domain/repositories/court.repository.port";

@Injectable()
export class PrismaCourtRepositoryAdapter implements CourtRepositoryPort {
	constructor(
		private readonly prisma: PrismaClient
	){
	}
	async getCourtDetail(courtId: string): Promise<Court> {
		return await this.prisma.court.findUnique({
			where: {
				id: courtId
			}
		});
	}
	async getCourtAvailable(tournamentId: string): Promise<Court[]> {
		return await this.prisma.court.findMany({
			where: {
				courtAvailable: true,
				tournamentId: tournamentId
			}
		});
	}
	async createMultipleCourts(tournamentId: string, numberOfCourt: number): Promise<Court[]> {
		const data: Prisma.CourtCreateManyInput[] = [];
		for (let i = 1; i <= numberOfCourt; i++) {
			data.push({
				courtCode: i.toString(),
				courtAvailable: true,
				tournamentId: tournamentId
			});
		}
		return await this.prisma.court.createManyAndReturn({
			data: data
		});
	}
	async getMatchesOfCourt(courtId: string): Promise<Match[]> {
		const court = await this.prisma.court.findUnique({
			where: {
				id: courtId
			}, 
			select: {
				matches: true
			}
		});
		return court.matches;
	}
	
}