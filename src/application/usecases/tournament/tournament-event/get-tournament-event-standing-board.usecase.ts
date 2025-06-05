import { HttpStatus, Inject } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";
import { TournamentEvent } from "@prisma/client";
import { ITournamentPrizesWithWinner, ITournamentStandingBoardInterface } from "../../../../domain/interfaces/tournament/tournament-event/tournament-standing-board.interface";

export class GetTournamentEventStandingBoardUseCase {
	constructor(
		@Inject("TournamentEventRepository")
		private readonly tournamentEventRepository: TournamentEventRepositoryPort,
	) {}

	async execute(
		tournamentEventId: string,
	): Promise<ApiResponse<ITournamentPrizesWithWinner>> {
		const tournamentEvent = await this.tournamentEventRepository.getTournamentEventById(tournamentEventId);
		if (tournamentEvent === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"No tournament event found!",
			null
		);
		const prizes = await this.tournamentEventRepository.isExistNotOthersPrize(tournamentEventId);
		if (prizes.length === 0) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"No prizes found for not other prizes!",
			null
		);
		return new ApiResponse<ITournamentPrizesWithWinner>(
			HttpStatus.OK,
			"Get Tournament Event Standing Board successfully",
			{
				prizes: await this.tournamentEventRepository.getTournamentEventStandingBoard(
					tournamentEventId,
				),
				otherPrizes: await this.tournamentEventRepository.getTournamentEventAwardsWithWinner(tournamentEventId)
			}
		);
	}
}
