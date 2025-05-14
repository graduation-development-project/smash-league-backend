import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TournamentRepositoryPort } from "../../../domain/repositories/tournament.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";

@Injectable()
export class CountTournamentStatusUseCase {
	constructor(
		@Inject("TournamentRepository")
		private tournamentRepository: TournamentRepositoryPort,
	) {}

	async execute(organizerId: string) {
		return new ApiResponse(
			HttpStatus.OK,
			"Count tournaments status successfully",
			await this.tournamentRepository.countTournamentStatusByOrganizerId(
				organizerId,
			),
		);
	}
}
