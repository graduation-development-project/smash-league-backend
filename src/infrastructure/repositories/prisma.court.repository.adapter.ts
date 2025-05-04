import { Injectable } from "@nestjs/common";
import { Court, Match, Prisma, PrismaClient } from "@prisma/client";
import { ICreateCourts } from "src/domain/interfaces/tournament/tournament.interface";
import { CourtRepositoryPort } from "src/domain/repositories/court.repository.port";
import { PrismaService } from "../services/prisma.service";

@Injectable()
export class PrismaCourtRepositoryAdapter implements CourtRepositoryPort {
	constructor(private readonly prisma: PrismaService) {}

	async createMultipleCourtsWithCourtCode(
		tournamentId: string,
		courts: ICreateCourts,
	): Promise<Court[]> {
		let courtsCreate: Prisma.CourtCreateManyInput[] = [];
		for (let i = 0; i < courts.createCourts.length; i++) {
			courtsCreate.push({
				courtCode: courts.createCourts[i].courtCode,
				tournamentId: tournamentId,
			});
		}
		return await this.prisma.court.createManyAndReturn({
			data: courtsCreate,
		});
	}

	async getCourtDetail(courtId: string): Promise<Court> {
		return await this.prisma.court.findUnique({
			where: {
				id: courtId,
			},
		});
	}

	async getCourtAvailable(tournamentId: string): Promise<Court[]> {
		return await this.prisma.court.findMany({
			where: {
				courtAvailable: true,
				tournamentId: tournamentId,
			},
		});
	}

	async createMultipleCourts(
		tournamentId: string,
		numberOfCourt: number,
	): Promise<Court[]> {
		const data: Prisma.CourtCreateManyInput[] = [];
		for (let i = 1; i <= numberOfCourt; i++) {
			data.push({
				courtCode: "Court: " + i.toString(),
				courtAvailable: true,
				tournamentId: tournamentId,
			});
		}
		return await this.prisma.court.createManyAndReturn({
			data: data,
		});
	}

	async getMatchesOfCourt(courtId: string): Promise<Match[]> {
		const court = await this.prisma.court.findUnique({
			where: {
				id: courtId,
			},
			select: {
				matches: true,
			},
		});
		return court.matches;
	}

	async updateCourtAvailability(
		courtId: string,
		isAvailable: boolean,
	): Promise<Court> {
		try {
			return this.prisma.court.update({
				where: {
					id: courtId,
				},

				data: {
					courtAvailable: isAvailable,
				},
			});
		} catch (e) {
			console.error("updateCourtAvailability failed: ", e);
			throw e;
		}
	}
}
