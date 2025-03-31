import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Match } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";

@Injectable()
export class StartMatchUseCase {
	constructor(
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort
	) {
	}

	async execute(matchId: string): Promise<ApiResponse<Match>> {
		const match = await this.matchRepository.getMatchDetail(matchId);
		if (match === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Match id not found!",
			null
		);
		return new ApiResponse<Match>(
			HttpStatus.NO_CONTENT,
			"Update start time for match successful!",
			await this.matchRepository.updateStartTimeForMatch(matchId)
		);
	}
}