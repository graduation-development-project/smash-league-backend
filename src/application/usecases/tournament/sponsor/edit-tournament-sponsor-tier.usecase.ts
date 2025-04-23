import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TournamentSponsorRepositoryPort } from "../../../../domain/repositories/tournament-sponsor.repository.port";
import { SponsorTier, TournamentSponsor } from "@prisma/client";
import { ApiResponse } from "../../../../domain/dtos/api-response";

@Injectable()
export class EditTournamentSponsorTierUseCase {
	constructor(
		@Inject("TournamentSponsorRepositoryPort")
		private tournamentSponsorRepository: TournamentSponsorRepositoryPort,
	) {}

	async execute(
		tournamentId: string,
		sponsorId: string,
		tier: SponsorTier,
	): Promise<ApiResponse<TournamentSponsor>> {
		return new ApiResponse(
			HttpStatus.OK,
			"Edit Tournament Sponsor Tier Successfully",
			await this.tournamentSponsorRepository.editTournamentSponsorTier(
				tournamentId,
				sponsorId,
				tier,
			),
		);
	}
}
