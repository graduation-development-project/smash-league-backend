import { HttpStatus, Inject } from "@nestjs/common";
import { MatchLog } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { MatchLogRepositoryPort } from "src/domain/repositories/match-log.repository.port";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";

export class GetAllMatchLogUseCase {
	constructor(
		@Inject("MatchLogRepositoryPort")
		private readonly matchLogRepository: MatchLogRepositoryPort,
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort
	) {
	}

	async execute(matchId: string): Promise<ApiResponse<MatchLog[]>> {
		const matchDetail = await this.matchRepository.getMatchDetail(matchId);
		if (matchDetail === null) return new ApiResponse<null>(
			HttpStatus.BAD_REQUEST,
			"Match not found!",
			null
		);
		return new ApiResponse<MatchLog[]>(
			HttpStatus.OK,
			"Get all match logs success!",
			await this.matchLogRepository.getAllMatchLogOfMatch(matchId)
		);
	}
}