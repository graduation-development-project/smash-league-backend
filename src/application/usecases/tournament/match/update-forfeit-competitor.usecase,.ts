import { HttpStatus, Inject } from "@nestjs/common";
import { Match } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";

export class UpdateForfeitCompetitorUseCase {
	constructor(
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort
	) {
	}

	async execute(matchId: string, forfeitCompetitorId: string) : Promise<ApiResponse<any>> {
		if (matchId === "" || matchId === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Not found match id!",
			null
		);
		const matchUpdated = await this.matchRepository.updateForfeitCompetitor(matchId, forfeitCompetitorId);
		return new ApiResponse<Match>(
			HttpStatus.NO_CONTENT,
			"Update forfeit competitor successful!",
			matchUpdated
		);
	}
}