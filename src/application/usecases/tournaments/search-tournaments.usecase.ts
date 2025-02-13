import { Inject, Injectable } from "@nestjs/common";
import { Tournament, User } from "@prisma/client";
import { TournamentsRepositoryPort } from "../../../domain/repositories/tournaments.repository";

@Injectable()
export class SearchTournamentsUseCase {
	constructor(
		@Inject("TournamentRepository") private tournamentRepository: TournamentsRepositoryPort,
	) {
	}

	async execute(searchTerm: string): Promise<Tournament[]> {
		return this.tournamentRepository.searchTournaments(searchTerm);
	}
}
