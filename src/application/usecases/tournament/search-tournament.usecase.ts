import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Tournament } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";
import {
	IPaginatedOutput,
	IPaginateOptions,
} from "../../../domain/interfaces/interfaces";

@Injectable()
export class SearchTournamentUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
	) {}

	async execute(
		options: IPaginateOptions,
		searchTerm?: string,
	): Promise<ApiResponse<IPaginatedOutput<Tournament>>> {
		return new ApiResponse<IPaginatedOutput<Tournament>>(
			HttpStatus.OK,
			"Get all tournaments successful!",
			await this.tournamentRepository.searchTournament(options, searchTerm),
		);
	}
}
