import { Inject, Injectable } from "@nestjs/common";
import { MatchRepositoryPort } from "../../../domain/repositories/match.repository.port";

@Injectable()
export class SkipMatchesUseCase {
	constructor(
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort,
	) {}

	async execute(eventId: string): Promise<void> {
		return this.matchRepository.skipMatchesExceptFirstAndFinal(eventId);
	}
}
