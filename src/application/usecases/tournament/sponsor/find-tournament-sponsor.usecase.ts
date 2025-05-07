import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TournamentSponsorRepositoryPort } from "../../../../domain/repositories/tournament-sponsor.repository.port";
import { ApiResponse } from "../../../../domain/dtos/api-response";
import { Sponsor } from "@prisma/client";

@Injectable()
export class FindTournamentSponsorUseCase {
	constructor(
		@Inject("TournamentSponsorRepositoryPort")
		private tournamentSponsorRepository: TournamentSponsorRepositoryPort,
	) {}

	async execute(tournamentId: string): Promise<ApiResponse<any>> {
		return new ApiResponse<any>(
			HttpStatus.OK,
			"Get Tournament Sponsors successfully",
			await this.tournamentSponsorRepository.findSponsorInTournament(
				tournamentId,
			),
		);
	}
}
