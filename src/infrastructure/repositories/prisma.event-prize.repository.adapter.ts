import { Injectable } from "@nestjs/common";
import { EventPrize, PrismaClient, PrizeType } from "@prisma/client";
import { ICreateEventPrize, IEventPrizeResponse } from "src/domain/dtos/event-prize/event-prize.interface";
import { EventPrizeRepositoryPort } from "src/domain/repositories/event-prize.repository.port";
import { convertStringToEnum } from "../util/enum-convert.util";

@Injectable()
export class PrismaEventPrizeRepositoryAdapter implements EventPrizeRepositoryPort {
	constructor(
		private readonly prisma: PrismaClient
	) {
	}
	async getOtherPrizesOfTournamentEvent(tournamentEventId: string): Promise<IEventPrizeResponse[] | null> {
		return await this.prisma.eventPrize.findMany({
			where: {
				tournamentEventId: tournamentEventId,
				prizeType: PrizeType.Others
			}
		});
	}
	async getPrize(prizeId: string): Promise<EventPrize> {
		return await this.prisma.eventPrize.findUnique({
			where: {
				id: prizeId
			}
		});
	}
	async updateWinnerForEventPrize(participantId: string, prizeId: string): Promise<EventPrize> {
		return await this.prisma.eventPrize.update({
			where: {
				id: prizeId
			}, 
			data: {
				winningParticipantId: participantId
			}
		});
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
				...createEventPrize,
				prizeType: convertStringToEnum(PrizeType, createEventPrize.prizeType)
			}
		});
	}
	updateEventPrizeOfTournamentEvent(): Promise<EventPrize[]> {
		throw new Error("Method not implemented.");
	}
}