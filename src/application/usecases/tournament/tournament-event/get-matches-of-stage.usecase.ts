import { Inject } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { StageRepositoryPort } from "src/domain/interfaces/repositories/stage.repository.port";

export class GetMatchesOfStageUseCase {
	constructor(
		@Inject("StageRepository")
		private readonly stageRepository: StageRepositoryPort
	) {
	}

	async execute() : Promise<ApiResponse<any>> {
		return;
	}
}