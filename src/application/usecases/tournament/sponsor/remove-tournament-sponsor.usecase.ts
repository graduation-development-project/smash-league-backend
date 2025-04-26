import {
	BadRequestException,
	HttpStatus,
	Inject,
	Injectable,
} from "@nestjs/common";
import { TournamentSponsorRepositoryPort } from "../../../../domain/repositories/tournament-sponsor.repository.port";
import { ApiResponse } from "../../../../domain/dtos/api-response";

@Injectable()
export class RemoveTournamentSponsorUseCase {
	constructor(
		@Inject("TournamentSponsorRepositoryPort")
		private tournamentSponsorRepository: TournamentSponsorRepositoryPort,
	) {}

	async execute(
		tournamentId: string,
		sponsorId: string,
	): Promise<ApiResponse<void>> {
		const sponsor =
			await this.tournamentSponsorRepository.findTournamentSponsor(
				tournamentId,
				sponsorId,
			);

		if (!sponsor) {
			throw new BadRequestException(
				"This sponsor not exist in this tournament",
			);
		}

		return new ApiResponse<void>(
			HttpStatus.NO_CONTENT,
			"Remove Tournament Sponsor successfully",
			await this.tournamentSponsorRepository.removeTournamentSponsor(
				tournamentId,
				sponsorId,
			),
		);
	}
}
