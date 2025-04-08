import { HttpStatus, Inject } from "@nestjs/common";
import { Match } from "@prisma/client";
import { match } from "node:assert";
import { ApiResponse } from "src/domain/dtos/api-response";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";

export class AssignAthleteIntoMatchUseCase {
	constructor(
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort
	) {
	}

	async execute(matchId: string, leftCompetitorId?: string, rightCompetitorId?: string): Promise<ApiResponse<Match>> {
		const matchDetail = await this.matchRepository.getMatchDetail(matchId);
		const numberOfMatch = await this.matchRepository.countMatchesOfLastStage(matchId);
		if (matchDetail.isByeMatch && matchDetail.matchNumber <= Math.floor(numberOfMatch)) {
			return await this.checkAssignRightAthleteIntoByeMatch(matchId, leftCompetitorId, rightCompetitorId);
		} else if (matchDetail.isByeMatch && matchDetail.matchNumber > Math.floor(numberOfMatch)) {
			return await this.checkAssignLeftAthleteIntoByeMatch(matchId, leftCompetitorId, rightCompetitorId);
		} 
		return await this.assignAthleteIntoMatch(matchId, leftCompetitorId, rightCompetitorId);
	}

	async checkAssignLeftAthleteIntoByeMatch(matchId: string, leftCompetitorId?: string, rightCompetitorId?: string): Promise<ApiResponse<Match>>{
		if (rightCompetitorId !== undefined || rightCompetitorId !== null) return new ApiResponse<null | undefined>(
			HttpStatus.OK,
			"This match cannot have right competitor!",
			null
		);
		if (leftCompetitorId === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Left competitor is null!",
			null
		);
		return new ApiResponse<Match>(
			HttpStatus.OK,
			"Updated competitor successful!",
			await this.matchRepository.assignAthleteIntoMatch(matchId, leftCompetitorId, null)
		);
	} 

	async checkAssignRightAthleteIntoByeMatch(matchId: string, leftCompetitorId?: string, rightCompetitorId?: string): Promise<ApiResponse<Match>> {
		if (leftCompetitorId !== null || leftCompetitorId !== undefined) return new ApiResponse<null | undefined>(
			HttpStatus.OK,
			"This match cannot have left competitor!",
			null
		);
		if (rightCompetitorId === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Right competitor is null!",
			null
		);
		return new ApiResponse<Match>(
			HttpStatus.OK,
			"Updated competitor successful!",
			await this.matchRepository.assignAthleteIntoMatch(matchId, null, rightCompetitorId)
		);
	}

	async assignAthleteIntoMatch(matchId: string, leftCompetitorId: string, rightCompetitorId: string): Promise<ApiResponse<Match>> {
		return new ApiResponse<Match>(
			HttpStatus.OK,
			"Update comeptitor successful!",
			await this.matchRepository.assignAthleteIntoMatch(matchId, leftCompetitorId, rightCompetitorId)
		);
	}
}