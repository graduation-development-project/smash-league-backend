import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AthletesRepositoryPort } from "../../../domain/interfaces/repositories/athletes.repository.port";
import { ResponseTeamLeaderTransferDTO } from "../../../domain/dtos/athletes/response-team-leader-transfer.dto";
import { ApiResponse } from "../../../domain/dtos/api-response";

@Injectable()
export class ResponseTransferTeamLeaderUseCase {
	constructor(
		@Inject("AthleteRepository")
		private athletesRepository: AthletesRepositoryPort,
	) {}

	async execute(
		responseTeamLeaderTransferDTO: ResponseTeamLeaderTransferDTO,
	): Promise<ApiResponse<null>> {
		return new ApiResponse<null>(
			HttpStatus.NO_CONTENT,
			await this.athletesRepository.responseToTransferTeamLeader(
				responseTeamLeaderTransferDTO,
			),
			null,
		);
	}
}
