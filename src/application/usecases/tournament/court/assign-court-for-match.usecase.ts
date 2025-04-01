import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Match } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { CourtRepositoryPort } from "src/domain/repositories/court.repository.port";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";

@Injectable()
export class AssignCourtForMatchUseCase {
	constructor(
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort,
		@Inject("CourtRepository")
		private readonly courtRepository: CourtRepositoryPort
	){
	}

	async execute(matchId: string, courtId: string): Promise<ApiResponse<Match>> {
		const match = await this.matchRepository.getMatchDetail(matchId);
		const court = await this.courtRepository.getCourtDetail(courtId);
		if (court.courtAvailable === false) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Court is not available now!",
			null
		);
		if (match.matchStatus != "NOT_STARTED") return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Cannot assign court for match that is starting or end already!",
			null
		);
		const matchUpdate = await this.matchRepository.assignCourtForMatch(matchId, courtId);
		return new ApiResponse<Match>(
			HttpStatus.NO_CONTENT,
			"Update court for match successful!",
			matchUpdate
		);
	}
}