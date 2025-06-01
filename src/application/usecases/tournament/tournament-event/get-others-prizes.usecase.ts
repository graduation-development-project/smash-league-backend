import { HttpStatus, Inject } from "@nestjs/common";
import { TournamentEvent } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IEventPrizeResponse } from "src/domain/dtos/event-prize/event-prize.interface";
import { EventPrizeRepositoryPort } from 'src/domain/repositories/event-prize.repository.port';
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";

export class GetOthersPrizesUseCase {
	constructor(
		@Inject("TournamentEventRepository")
		private readonly tournamentEventRepository: TournamentEventRepositoryPort,
		@Inject("EventPrizeRepository")
		private readonly eventPrizeRepository: EventPrizeRepositoryPort
	) {
	}

	async execute(tournamentEventId: string): Promise<ApiResponse<IEventPrizeResponse[]>> {
		const tournamentEvent = await this.tournamentEventRepository.getTournamentEventById(tournamentEventId);
		if (tournamentEvent === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Tournament Event not found!",
			null
		);
		const otherPrizes = await this.eventPrizeRepository.getOtherPrizesOfTournamentEvent(tournamentEventId);
		if (otherPrizes.length === 0) return new ApiResponse<null | undefined>(
			HttpStatus.OK,
			"No prizes found!",
			null
		);
		return new ApiResponse<IEventPrizeResponse[]>(
			HttpStatus.OK,
			"Get all other prizes success!",
			otherPrizes
		);
	}
}