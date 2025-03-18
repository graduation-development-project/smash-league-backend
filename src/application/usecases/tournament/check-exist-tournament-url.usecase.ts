import { HttpStatus, Inject } from "@nestjs/common";
import { Tournament } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";

export class CheckExistTournamentURLUseCase {
	constructor(
		@Inject("TournamentRepository") 
		private readonly tournamentRepository: TournamentRepositoryPort
	) {	
	}

	async execute(url: string): Promise<ApiResponse<boolean>> {
		if (url === null || url === "" || url === ":url") return new ApiResponse<boolean>(
			HttpStatus.BAD_REQUEST,
			"URL is not empty!!",
			true
		);
		const tournament: Tournament | null = await this.tournamentRepository.getTournament(url);
		if (tournament === null) return new ApiResponse<boolean>(
			HttpStatus.OK,
			"URL is not exist!",
			true
		);
		return new ApiResponse<boolean>(
			HttpStatus.OK,
			"URL for tournament is existed!",
			false
		);
	}
}