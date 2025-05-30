import { HttpStatus, Inject } from '@nestjs/common';
import { ApiResponse } from 'src/domain/dtos/api-response';
import { MatchRepositoryPort } from 'src/domain/repositories/match.repository.port';
import { StageRepositoryPort } from 'src/domain/repositories/stage.repository.port';
import { TournamentEventRepositoryPort } from 'src/domain/repositories/tournament-event.repository.port';
export class GetBracketUseCase {
	constructor(
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort,
		@Inject("TournamentEventRepository")
		private readonly tournamentEventRepository: TournamentEventRepositoryPort,
		@Inject("StageRepository")
		private readonly stageRepository: StageRepositoryPort
	) {
	}

	async execute(tournamentEventId: string): Promise<ApiResponse<any>> {
		const thirdPlaceStage = await this.stageRepository.getThirdPlaceStageOfTournamentEvent(tournamentEventId);
		const tournamentEvent = await this.tournamentEventRepository.getTournamentEventById(tournamentEventId);
		if (tournamentEvent === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Tournament event not found!",
			null
		);
		const matches = await this.matchRepository.getBracketOfTournamentEvent(tournamentEventId);
		if (matches.length === 0) return new ApiResponse<null | undefined>(
			HttpStatus.OK,
			"No match found!",
			null
		);
		return new ApiResponse<any[]>(
			HttpStatus.OK,
			"Get bracket success!",
			matches
		);
	}
}