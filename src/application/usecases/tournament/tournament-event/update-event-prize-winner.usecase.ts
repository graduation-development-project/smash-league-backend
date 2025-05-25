import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { EventPrize, TournamentParticipants } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { EventPrizeRepositoryPort } from "src/domain/repositories/event-prize.repository.port";
import { TournamentParticipantsRepositoryPort } from "src/domain/repositories/tournament-participant.repository.port";

@Injectable()
export class UpdateEventPrizeWinnerUseCase {
	constructor(
		@Inject("EventPrizeRepository")
		private readonly prizeRepository: EventPrizeRepositoryPort,
		@Inject("TournamentParticipantRepositoryPort")
		private readonly tournamentParticipantRepository: TournamentParticipantsRepositoryPort
	) {
	}

	async execute(prizeId: string, participantId: string): Promise<ApiResponse<EventPrize>> {
		const tournamentParticipant = await this.tournamentParticipantRepository.getTournamentParticipantDetail(participantId);
		if (tournamentParticipant === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Participant not found!",
			null
		);
		const eventPrize = await this.prizeRepository.getPrize(prizeId);
		if (eventPrize === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Event prize not found!",
			null
		);
		return new ApiResponse<EventPrize>(
			HttpStatus.NO_CONTENT,
			"Update winner for event prize success!",
			await this.prizeRepository.updateWinnerForEventPrize(participantId, prizeId)
		);
	}

}