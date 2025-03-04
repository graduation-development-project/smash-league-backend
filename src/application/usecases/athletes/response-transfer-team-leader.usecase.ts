import { Inject, Injectable } from "@nestjs/common";
import { AthletesRepositoryPort } from "../../../domain/repositories/athletes.repository.port";
import { ResponseTeamLeaderTransferDTO } from "../../../domain/dtos/athletes/response-team-leader-transfer.dto";

@Injectable()
export class ResponseTransferTeamLeaderUseCase {
	constructor(
		@Inject("AthleteRepository")
		private athletesRepository: AthletesRepositoryPort,
	) {}

	execute(
		responseTeamLeaderTransferDTO: ResponseTeamLeaderTransferDTO,
	): Promise<string> {
		return this.athletesRepository.responseToTransferTeamLeader(
			responseTeamLeaderTransferDTO,
		);
	}
}
