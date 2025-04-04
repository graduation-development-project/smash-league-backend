import { HttpStatus, Inject } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";
import { TournamentEvent } from "@prisma/client";
import { ITournamentStandingBoardInterface } from "../../../../domain/interfaces/tournament/tournament-event/tournament-standing-board.interface";

export class GetTournamentEventStandingBoardUseCase {
	constructor(
		@Inject("TournamentEventRepository")
		private readonly tournamentEventRepository: TournamentEventRepositoryPort,
	) {}

	async execute(
		tournamentEventId: string,
	): Promise<ApiResponse<ITournamentStandingBoardInterface>> {
		return new ApiResponse<ITournamentStandingBoardInterface>(
			HttpStatus.OK,
			"Get Tournament Event Standing Board successfully",
			await this.tournamentEventRepository.getTournamentEventStandingBoard(
				tournamentEventId,
			),
		);
	}
}
