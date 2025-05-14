import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { MatchRepositoryPort } from "../../../domain/repositories/match.repository.port";

@Injectable()
export class CountMatchesStatusUseCase {
	constructor(
		@Inject("MatchRepository")
		private matchRepository: MatchRepositoryPort,
	) {}

	async execute(organizerId: string) {
		return new ApiResponse(
			HttpStatus.OK,
			"Count tournaments status successfully",
			await this.matchRepository.countMatchesStatusByOrganizerId(organizerId),
		);
	}
}
