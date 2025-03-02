import { Inject, Injectable } from "@nestjs/common";
import { TeamLeadersRepositoryPort } from "../../../domain/repositories/team-leaders.repository.port";
import { ResponseLeaveTeamRequestDTO } from "../../../domain/dtos/team-leaders/response-leave-team-request.dto";

@Injectable()
export class ResponseLeaveTeamRequestUseCase {
	constructor(
		@Inject("TeamLeaderRepository")
		private teamLeaderRepository: TeamLeadersRepositoryPort,
	) {}

	execute(responseLeaveTeamRequestDTO: ResponseLeaveTeamRequestDTO) {
		return this.teamLeaderRepository.responseLeaveTeamRequest(
			responseLeaveTeamRequestDTO,
		);
	}
}
