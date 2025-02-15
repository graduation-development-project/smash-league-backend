import { Inject, Injectable } from "@nestjs/common";
import { Tournament, User } from "@prisma/client";
import { TournamentsRepositoryPort } from "../../../domain/repositories/tournaments.repository";
import {
	IPaginatedOutput,
	IPaginateOptions,
} from "../../../infrastructure/interfaces/interfaces";

@Injectable()
export class SearchTournamentsUseCase {
	constructor(
		@Inject("TournamentRepository")
		private tournamentRepository: TournamentsRepositoryPort,
	) {}

	async execute(
		searchTerm: string,
		options: IPaginateOptions,
	): Promise<IPaginatedOutput<Tournament>> {
		return this.tournamentRepository.searchTournaments(searchTerm, options);
	}
}
