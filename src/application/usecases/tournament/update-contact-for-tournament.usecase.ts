import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Tournament } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { UpdateTournamentContact } from "src/domain/interfaces/tournament/tournament.validation";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";
@Injectable()
export class UpdateContactForTournamentUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort
	) {
	}

	async execute(updateContact: UpdateTournamentContact): Promise<ApiResponse<Tournament>> {
		const tournament = await this.tournamentRepository.getTournament(updateContact.id);
		if (tournament === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Tournament id not found!",
			null
		);
		return new ApiResponse<Tournament>(
			HttpStatus.NO_CONTENT,
			"Update tournament contact successful!",
			await this.tournamentRepository.updateTournamentContact({
				...updateContact
			})
		);
	}
}