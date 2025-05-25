import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { MatchRepositoryPort } from "../../../../domain/repositories/match.repository.port";
import { ApiResponse } from "../../../../domain/dtos/api-response";

@Injectable()
export class CountMatchesInCurrentWeekUseCase {
	constructor(
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort,
	) {}

	async execute(organizerId: string): Promise<
		ApiResponse<{
			currentCount: number;
			previousCount: number;
			changeRate: number;
		}>
	> {
		return new ApiResponse<{
			currentCount: number;
			previousCount: number;
			changeRate: number;
		}>(
			HttpStatus.OK,
			"Get number of matches in current week Successfully",
			await this.matchRepository.countNumberOfMatchesInCurrentWeek(organizerId),
		);
	}
}
