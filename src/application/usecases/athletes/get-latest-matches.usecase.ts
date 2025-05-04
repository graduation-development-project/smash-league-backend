import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { MatchRepositoryPort } from "../../../domain/repositories/match.repository.port";
import { Match } from "@prisma/client";

@Injectable()
export class GetLatestMatchesUseCase {
	constructor(
		@Inject("MatchRepository")
		private matchRepository: MatchRepositoryPort,
	) {}

	async execute(userID: string): Promise<ApiResponse<Match[]>> {
		return new ApiResponse(
			HttpStatus.OK,
			"Get latest matches of user successfully.",
			await this.matchRepository.getLatestMatchesOfUser(userID),
		);
	}
}
