import { HttpStatus, Inject } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";

import { UmpireRepositoryPort } from "../../../domain/repositories/umpire.repository.port";
import { UmpireUpdateMatchDTO } from "../../../domain/dtos/umpire/umpire-update-match.dto";
import { Match } from "@prisma/client";

export class GetAssignedMatchUseCase {
	constructor(
		@Inject("UmpireRepository")
		private readonly umpireRepositoryPort: UmpireRepositoryPort,
	) {}

	async execute(umpireId: string): Promise<ApiResponse<Match[]>> {
		return new ApiResponse<Match[]>(
			HttpStatus.OK,
			"Get umpire's assigned matches successfully",
			await this.umpireRepositoryPort.getAssignedMatches(umpireId),
		);
	}
}
