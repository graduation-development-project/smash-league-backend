import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Match } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IMatchQueryResponse } from "src/domain/interfaces/tournament/match/match.query";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";

@Injectable()
export class GetMatchByIdUseCase {
	constructor(
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort
	) {
	}

	async execute(matchId: string): Promise<ApiResponse<IMatchQueryResponse>> {
		const match = await this.matchRepository.getMatchDetailById(matchId);
		if (match === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Match not found!",
			null
		);
		return new ApiResponse<IMatchQueryResponse>(
			HttpStatus.OK,
			"Match found successfully!",
			match
		);
	}
}