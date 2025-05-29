import { HttpStatus, Inject } from "@nestjs/common";
import { Match } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";

export class GetMatchesOfTournamentEventUseCase {
	constructor(
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort,
		@Inject("TournamentEventRepository")
		private readonly tournamentEventRepository: TournamentEventRepositoryPort
	) {
	}

	async execute(tournamentEventId: string): Promise<ApiResponse<any>> {
		const tournamentEvent = await this.tournamentEventRepository.getTournamentEventById(tournamentEventId);
		if (tournamentEvent === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Cannot found tournament event!",
			null
		);
		const matches = await this.matchRepository.getAllMatchesOfTournamentEvent(tournamentEventId);
		// if (matches.length === 0) return new ApiResponse<null | undefined>(
		// 	HttpStatus.NOT_FOUND,
		// 	"No matches found!",
		// 	null
		// );
		return new ApiResponse<Match[]>(
			HttpStatus.OK, 
			"Get all matches of tournament event successful!",
			matches
		);
	}
}