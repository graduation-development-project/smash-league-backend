import { Inject, Injectable } from "@nestjs/common";
import { MatchRepositoryPort } from "../../../domain/repositories/match.repository.port";

@Injectable()
export class AssignPlayerToMatchesUseCase {
	constructor(
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort,
	) {}

	async execute(tournamentEventId: string): Promise<void> {
		return this.matchRepository.assignPlayersToFirstRoundMatches(tournamentEventId);
	}
}
