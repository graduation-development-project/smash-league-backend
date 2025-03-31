import { HttpStatus, Inject } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ITournamentEventParticipants } from "src/domain/interfaces/tournament/tournament-event/tournament-event.interface";
import { TournamentEventRepositoryPort } from "src/domain/interfaces/repositories/tournament-event.repository.port";
import { TournamentEvent } from "@prisma/client";

export class GetTournamentEventsByTournamentIdUseCase {
	constructor(
		@Inject("TournamentEventRepository")
		private readonly tournamentEventRepository: TournamentEventRepositoryPort,
	) {}

	async execute(tournamentId: string): Promise<ApiResponse<TournamentEvent[]>> {
		return new ApiResponse<TournamentEvent[]>(
			HttpStatus.OK,
			"Get Tournament Event by Tournament Id successfully",
			await this.tournamentEventRepository.getTournamentEventOfTournament(
				tournamentId,
			),
		);
	}
}
