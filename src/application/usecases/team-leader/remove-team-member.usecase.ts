import { Inject, Injectable } from "@nestjs/common";
import { TeamLeadersRepositoryPort } from "../../../domain/repositories/team-leaders.repository.port";
import { RemoveTeamMemberDTO } from "../../../domain/dtos/team-leaders/remove-team-member.dto";

@Injectable()
export class RemoveTeamMemberUseCase {
	constructor(
		@Inject("TeamLeaderRepository")
		private teamLeaderRepository: TeamLeadersRepositoryPort,
	) {}

	execute(removeTeamMemberDTO: RemoveTeamMemberDTO) {
		return this.teamLeaderRepository.removeTeamMember(removeTeamMemberDTO);
	}
}
