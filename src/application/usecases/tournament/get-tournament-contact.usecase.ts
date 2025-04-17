import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ITournamentContact } from "src/domain/interfaces/tournament/tournament.interface";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";

@Injectable()
export class GetTournamentContactUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort
	) {
	}

	async execute(id: string): Promise<ApiResponse<ITournamentContact>> {
		const tournament = await this.tournamentRepository.getTournament(id);
		if (tournament === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Tournament id not found!",
			null
		);
		return new ApiResponse<ITournamentContact>(
			HttpStatus.OK,
			"Get tournament contact successful!",
			await this.tournamentRepository.getTournamentContact(id)
		);
	}
}