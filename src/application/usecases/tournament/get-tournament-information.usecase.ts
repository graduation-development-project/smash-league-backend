import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ITournamentInformation } from "src/domain/interfaces/tournament/tournament.interface";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";

@Injectable()
export class GetTournamentInformationUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort
	) {
	}

	async execute(id: string): Promise<ApiResponse<ITournamentInformation>> {
		const tournament = await this.tournamentRepository.getTournament(id);
		if (tournament === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Tournament id not found!",
			null
		);
		return new ApiResponse<ITournamentInformation>(
			HttpStatus.OK,
			"Get tournament information successful!",
			await this.tournamentRepository.getTournamentInformation(id)
		);
	}
}