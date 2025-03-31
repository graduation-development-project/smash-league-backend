import { HttpStatus, Inject } from "@nestjs/common";
import { Tournament } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { TournamentRepositoryPort } from "src/domain/interfaces/repositories/tournament.repository.port";
import { v4 as uuidv4 } from "uuid";

export class CreateRandomURLUseCase {
	constructor(
		@Inject("TournamentRepository") 
		private readonly tournamentRepository: TournamentRepositoryPort
	) {	
	}

	async execute() : Promise<ApiResponse<string>> {
		let check = false;
		let url = "";
		do {
			url = uuidv4();
			const tournament: Tournament | null = await this.tournamentRepository.getTournament(url);
			if (tournament === null) check = true;
		} while (check === false);
		return new ApiResponse<string>(
			HttpStatus.OK,
			"New URL generated!",
			url
		);
	}
}