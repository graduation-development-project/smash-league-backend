import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { EventPrize } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { CreateEventPrizeRequest } from "src/domain/dtos/event-prize/event-prize.validation";
import { EventPrizeRepositoryPort } from "src/domain/repositories/event-prize.repository.port";
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";

@Injectable()
export class CreateEventPrizeUseCase {
	constructor(
		@Inject("EventPrizeRepository")
		private readonly eventPrizeRepository: EventPrizeRepositoryPort,
		@Inject("TournamentEventRepository")
		private readonly tournamentEventRepository: TournamentEventRepositoryPort
	) {
	}

	async execute(createEventPrize: CreateEventPrizeRequest): Promise<ApiResponse<EventPrize>> {
		const tournamentEvent = await this.tournamentEventRepository.getTournamentEventById(createEventPrize.tournamentEventId);
		if (tournamentEvent === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Tournament id not found!",
			null
		);
		try {
			const eventPrize = await this.eventPrizeRepository.createEventPrizeOfTournamentEvent({
				...createEventPrize
			});
			return new ApiResponse<EventPrize>(
				HttpStatus.CREATED,
				"Create new event prize success!",
				eventPrize
			);
		} catch (e) {
			return new ApiResponse<null | undefined>(
				HttpStatus.INTERNAL_SERVER_ERROR,
				e,
				null
			);
		}
		return;
	}
}