import { Injectable } from "@nestjs/common";
import { EventPrize, PrismaClient, PrizeType } from "@prisma/client";
import { ICreateEventPrize } from "src/domain/dtos/event-prize/event-prize.interface";
import { EventPrizeRepositoryPort } from "src/domain/repositories/event-prize.repository.port";

@Injectable()
export class PrismaEventPrizeRepositoryAdapter implements EventPrizeRepositoryPort {
	constructor(
		private readonly prisma: PrismaClient
	) {
	}
	async getAllPrizeOfEvent(tournamentEventId: string): Promise<EventPrize[]> {
		return await this.prisma.eventPrize.findMany({
			where: {
				tournamentEventId: tournamentEventId
			}
		});
	}
	async getChampionshipPrizeOfTournamentEvent(tournamentEventId: string): Promise<EventPrize | null> {
		return await this.prisma.eventPrize.findFirst({
			where: {
				tournamentEventId: tournamentEventId,
				prizeType: PrizeType.ChampionshipPrize
			}
		});
	}
	async getRunnerUpPrizeOfTournamentEvent(tournamentEventId: string): Promise<EventPrize | null> {
		return await this.prisma.eventPrize.findFirst({
			where: {
				tournamentEventId: tournamentEventId,
				prizeType: PrizeType.RunnerUpPrize
			}
		});
	}
	async getThirdPlacePrizeOfTournamentEvent(tournamentEventId: string): Promise<EventPrize[] | null> {
		return await this.prisma.eventPrize.findMany({
			where: {
				tournamentEventId: tournamentEventId,
				prizeType: PrizeType.ThirdPlacePrize
			}
		});
	}
	async createEventPrizeOfTournamentEvent(createEventPrize: ICreateEventPrize): Promise<EventPrize> {
		return await this.prisma.eventPrize.create({
			data: {
				...createEventPrize
			}
		});
	}
	updateEventPrizeOfTournamentEvent(): Promise<EventPrize[]> {
		throw new Error("Method not implemented.");
	}
}