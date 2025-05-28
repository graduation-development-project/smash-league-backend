import { HttpStatus, Inject } from "@nestjs/common";
import { Match } from "@prisma/client";
import { match } from "assert";
import { ApiResponse } from "src/domain/dtos/api-response";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";

export class UpdateAttendanceUseCase {
	constructor(
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort
	) {
	}

	async execute(matchId: string, leftCompetitorAttendance: boolean, rightCompetitorAttendance: boolean): Promise<ApiResponse<any>> {
		const match = await this.matchRepository.getMatchDetail(matchId);
		if (match === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"No match found!",
			null
		);
		const nextMatch = await this.matchRepository.getMatchDetail(match.nextMatchId);
		if (leftCompetitorAttendance === true && rightCompetitorAttendance === false) {
			const matchWinnerUpdated = await this.matchRepository.updateMatchWinner(match.id, match.leftCompetitorId);
			const updatedMatch = await this.updateCompetitorForNextMatch(match, nextMatch, match.leftCompetitorId);
			const updatedEndMatch = await this.matchRepository.updateMatchEnd(match.id);
		} else if (leftCompetitorAttendance === false && rightCompetitorAttendance === true) {
			const matchWinnerUpdated = await this.matchRepository.updateMatchWinner(matchId, match.rightCompetitorId);
			const updatedMatch = await this.updateCompetitorForNextMatch(match, nextMatch, match.rightCompetitorId);
			const updatedEndMatch = await this.matchRepository.updateMatchEnd(match.id);
		} else if (leftCompetitorAttendance === false && rightCompetitorAttendance === false) {
			const updatedByeMatch = await this.matchRepository.updateByeMatch(match.nextMatchId, true);
			const updatedMatchEnded = await this.matchRepository.updateMatchEnd(match.id);
		}
		// console.log(Boolean(leftCompetitorAttendance), ' ', Boolean(rightCompetitorAttendance));
		const matchUpdated = await this.matchRepository.updateAttendance(matchId, leftCompetitorAttendance, rightCompetitorAttendance);
		return new ApiResponse<Match>(
			HttpStatus.NO_CONTENT,
			"Update attendance successful!",
			matchUpdated
		);
	}

	async updateCompetitorForNextMatch(currentMatch: Match, nextMatch: Match, winningCompetitorId: string): Promise<Match> {
		const matchesPrevious = await this.matchRepository.getMatchesPrevious(nextMatch.id);
		console.log(matchesPrevious);
		if (currentMatch.id === matchesPrevious[0].id) {
			const updatedNextMatch = await this.matchRepository.assignAthleteIntoMatch(nextMatch.id, winningCompetitorId, nextMatch.rightCompetitorId);
			return updatedNextMatch;
		} else if (currentMatch.id === matchesPrevious[1].id) {
			const updatedNextMatch = await this.matchRepository.assignAthleteIntoMatch(nextMatch.id, nextMatch.leftCompetitorId, winningCompetitorId);
			return updatedNextMatch;
		}
		return;
	}
}