import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
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

	async execute(gameId: string, winningId: string): Promise<ApiResponse<any>> {
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
		const game = await this.matchRepository.updatePoint(gameId, winningId);
		return new ApiResponse<any>(
			HttpStatus.OK,
			"Update point successful!",
			game
		);
	}
}