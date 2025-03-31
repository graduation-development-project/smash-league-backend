import { Inject, Injectable } from "@nestjs/common";
import { TeamLeadersRepositoryPort } from "../../../domain/interfaces/repositories/team-leaders.repository.port";
import { ResponseLeaveTeamRequestDTO } from "../../../domain/dtos/team-leaders/response-leave-team-request.dto";

@Injectable()
export class ResponseJoinTeamRequestUseCase {
	constructor(
		@Inject("TeamLeaderRepository")
		private teamLeaderRepository: TeamLeadersRepositoryPort,
	) {}

	execute(responseJoinTeamRequestDTO: ResponseLeaveTeamRequestDTO) {
		return this.teamLeaderRepository.responseJoinTeamRequest(
			responseJoinTeamRequestDTO,
		);
	}
}
