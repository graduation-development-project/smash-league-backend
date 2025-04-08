import { HttpStatus, Inject } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IParticipantsOfTournamentEvent, ITournamentEventParticipants } from "src/domain/interfaces/tournament/tournament-event/tournament-event.interface";
import { ITournamentEventDetail } from "src/domain/interfaces/tournament/tournament.interface";
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";

export class GetParticipantsByTournamentEventUseCase {
	constructor(
		@Inject("TournamentEventRepository")
		private readonly tournamentEventRepository: TournamentEventRepositoryPort
	) {
	}

	async execute(tournamentEventId: string): Promise<ApiResponse<IParticipantsOfTournamentEvent>> {
		const tournamentEventParticipants = await this.tournamentEventRepository.getParticipantsByTournamentEvent(tournamentEventId);
		if (tournamentEventParticipants.numberOfParticipants === 0) 
			return new ApiResponse<null | undefined>(
				HttpStatus.NOT_FOUND,
				"Not found any participants in this tournament event!",
				null
			);
		return new ApiResponse<IParticipantsOfTournamentEvent>(
			HttpStatus.OK,
			"Get all participants of tournament event successful!",
			tournamentEventParticipants
		);		
	}
}