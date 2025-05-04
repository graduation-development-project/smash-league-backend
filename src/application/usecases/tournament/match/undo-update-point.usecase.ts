import { Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";

@Injectable()
export class UndoUpdatePointUseCase {
	constructor(
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort
	) {
	}

	async execute(gameId: string): Promise<ApiResponse<any>> {
		return;
	}
}