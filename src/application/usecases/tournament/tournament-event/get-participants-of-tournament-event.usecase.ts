import { HttpStatus, Inject } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ITournamentEventParticipants } from "src/domain/interfaces/tournament/tournament-event/tournament-event.interface";
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";

export class GetParticipantsOfTournamentEventUseCase {
	constructor(
		@Inject("TournamentEventRepository")
		private readonly tournamentEventRepository: TournamentEventRepositoryPort
	){
	}

	async execute(tournamentEventId: string) : Promise<ApiResponse<ITournamentEventParticipants>> {
		const tournamentEventParticipants = await this.tournamentEventRepository.getParticipantsOfTournamentEvent(tournamentEventId);
		if (tournamentEventParticipants.numberOfParticipants === 0) 
			return new ApiResponse<null | undefined>(
				HttpStatus.NOT_FOUND,
				"Not found any participants in this tournament event!",
				null
			);
		return new ApiResponse<ITournamentEventParticipants>(
			HttpStatus.OK,
			"Get all participants of tournament event successful!",
			tournamentEventParticipants
		);
	} 
}