import { HttpStatus, Inject } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";

import { UmpireRepositoryPort } from "../../../domain/repositories/umpire.repository.port";
import { UmpireUpdateMatchDTO } from "../../../domain/dtos/umpire/umpire-update-match.dto";
import { Tournament } from "@prisma/client";

export class GetUmpireParticipatedTournamentsUseCase {
	constructor(
		@Inject("UmpireRepository")
		private readonly umpireRepositoryPort: UmpireRepositoryPort,
	) {}

	async execute(
		umpireId: string,
	): Promise<ApiResponse<Tournament[]>> {
		return new ApiResponse<Tournament[]>(
			HttpStatus.OK,
			"Get Participated Tournaments successfully",
			await this.umpireRepositoryPort.getParticipateTournaments(umpireId),
		);
	}
}
