import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { MatchStatus } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IGameAfterUpdatePointResponse } from "src/domain/interfaces/tournament/match/game.interface";
import { GameRepositoryPort } from "src/domain/repositories/game.repository.port";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";
@Injectable()
export class UpdatePointUseCase {
	constructor(
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort,
		@Inject("GameRepository")
		private readonly gameRepository: GameRepositoryPort
	) {
	}

	async execute(gameId: string, winningId: string): Promise<ApiResponse<IGameAfterUpdatePointResponse>> {
		const gameDetail = await this.gameRepository.getGame(gameId);
		// console.log(gameDetail);
		if (gameDetail === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Game not found!",
			null
		);
		if (gameDetail.gameWonByCompetitorId !== null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Game has already ended!",
			null
		);
		const match = await this.matchRepository.getMatchDetail(gameDetail.matchId);
		if (match.matchStatus === MatchStatus.INTERVAL) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Match is on status Internal! Please continue match before updating point!",
			null
		);
		const game = await this.matchRepository.updatePoint(gameId, winningId);
		return new ApiResponse<IGameAfterUpdatePointResponse>(
			HttpStatus.OK,
			"Update point successful!",
			game
		);
	}
}