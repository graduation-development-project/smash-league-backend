import { HttpStatus, Inject } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IEventPrizeResponse } from "src/domain/dtos/event-prize/event-prize.interface";
import { EventPrizeRepositoryPort } from "src/domain/repositories/event-prize.repository.port";

export class GetChampionshipPrizeOfEventUseCase {
	constructor(
		@Inject("EventPrizeRepository")
		private readonly eventPrizeRepository: EventPrizeRepositoryPort
	) {
	}

	async execute(tournamentEventId: string): Promise<ApiResponse<IEventPrizeResponse>> {
		const prize = await this.eventPrizeRepository.getChampionshipPrizeOfTournamentEvent(tournamentEventId);
		if (prize === null) return new ApiResponse<null | undefined>(
			HttpStatus.OK,
			"No prize found!",
			null
		);
		return new ApiResponse<IEventPrizeResponse>(
			HttpStatus.OK,
			"Get all prize success!",
			prize
		);
	}
}