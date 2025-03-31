import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Game, Match } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";

@Injectable()
export class StartMatchUseCase {
	constructor(
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort
	) {
	}

	async execute(matchId: string, currentServerId: string): Promise<ApiResponse<Game>> {
		const match = await this.matchRepository.getMatchDetail(matchId);
		if (match === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Match id not found!",
			null
		);
		if (currentServerId != match.leftCompetitorId && currentServerId != match.rightCompetitorId) 
			return new ApiResponse<null | undefined>(
				HttpStatus.BAD_REQUEST,
				"Current server Id is not exist in this match!",
				null
			);
		return new ApiResponse<Game>(
			HttpStatus.NO_CONTENT,
			"Update start time for match successful!",
			await this.matchRepository.updateStartTimeForMatch(matchId, currentServerId)
		);
	}
}