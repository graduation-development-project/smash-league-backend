import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Match } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";

@Injectable()
export class ContinueMatchUseCase {
	constructor(
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort
	) {
	}

	async execute(matchId: string): Promise<ApiResponse<Match>> {
		const matchDetail = await this.matchRepository.getMatchDetail(matchId);
		if (matchDetail === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Match not exist!",
			null
		);
		return new ApiResponse<Match>(
			HttpStatus.NO_CONTENT,
			"Continue match success!",
			await this.matchRepository.continueMatch(matchId)
		);
	}
}