import { HttpStatus, Inject } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ITournamentRegistrationInformation } from "src/domain/interfaces/tournament/tournament.interface";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";

export class GetTournamentRegistrationInformationUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort
	) {
	}

	async execute(id: string): Promise<ApiResponse<ITournamentRegistrationInformation>> {
		const tournament = await this.tournamentRepository.getTournament(id);
		if (tournament === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Tournament id not found!",
			null
		);
		return new ApiResponse<ITournamentRegistrationInformation>(
			HttpStatus.OK,
			"Get tournament registration information successful!",
			await this.tournamentRepository.getTournamentRegistration(id)
		);
	}
}