import { ApiResponse } from "src/domain/dtos/api-response";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";

export class UpdatePointUseCase {
	constructor(
		private readonly matchRepository: MatchRepositoryPort
	) {
	}

	async execute(matchId: string, winningId: string): Promise<ApiResponse<any>> {
		const game = await this.matchRepository.updatePoint
		return;
	}
}