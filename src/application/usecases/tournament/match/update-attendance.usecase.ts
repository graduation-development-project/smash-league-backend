import { HttpStatus, Inject } from "@nestjs/common";
import { Match } from "@prisma/client";
import { match } from "assert";
import { ApiResponse } from "src/domain/dtos/api-response";
import { MatchRepositoryPort } from "src/domain/interfaces/repositories/match.repository.port";

export class UpdateAttendanceUseCase {
	constructor(
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort
	) {
	}

	async execute(matchId: string, leftCompetitorAttendance: boolean, rightCompetitorAttendance: boolean): Promise<ApiResponse<any>> {
		if (matchId === "" || matchId === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"No match id found!",
			null
		);
		const matchUpdated = await this.matchRepository.updateAttendance(matchId, leftCompetitorAttendance, rightCompetitorAttendance);
		return new ApiResponse<Match>(
			HttpStatus.NO_CONTENT,
			"Update attendance successful!",
			matchUpdated
		);
	}
}