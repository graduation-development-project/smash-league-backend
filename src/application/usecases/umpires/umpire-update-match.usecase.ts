import { HttpStatus, Inject } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";

import { UmpireRepositoryPort } from "../../../domain/repositories/umpire.repository.port";
import { UmpireUpdateMatchDTO } from "../../../domain/dtos/umpire/umpire-update-match.dto";

export class UmpireUpdateMatchUseCase {
	constructor(
		@Inject("UmpireRepository")
		private readonly umpireRepositoryPort: UmpireRepositoryPort,
	) {}

	async execute(
		updateMatchDTO: UmpireUpdateMatchDTO,
	): Promise<ApiResponse<null>> {
		return new ApiResponse<null>(
			HttpStatus.NO_CONTENT,
			await this.umpireRepositoryPort.umpireUpdateMatch(updateMatchDTO),
			null,
		);
	}
}
