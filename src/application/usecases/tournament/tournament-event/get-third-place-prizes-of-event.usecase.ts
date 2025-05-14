import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IEventPrizeResponse } from "src/domain/dtos/event-prize/event-prize.interface";
import { EventPrizeRepositoryPort } from "src/domain/repositories/event-prize.repository.port";

@Injectable()
export class GetThirdPlacePrizesOfEventUseCase {
	constructor(
		@Inject("EventPrizeRepository")
		private readonly eventPrizeRepository: EventPrizeRepositoryPort
	) {
	}

	async execute(tournamentEventId: string): Promise<ApiResponse<IEventPrizeResponse[]>> {
		const prizes = await this.eventPrizeRepository.getThirdPlacePrizeOfTournamentEvent(tournamentEventId);
		if (prizes.length === 0) return new ApiResponse<null | undefined>(
			HttpStatus.OK,
			"No prize found!",
			null
		);
		return new ApiResponse<IEventPrizeResponse[]>(
			HttpStatus.OK,
			"Get prize success!",
			prizes
		);
	}	
}