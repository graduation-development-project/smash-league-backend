import { Inject, Injectable } from "@nestjs/common";
import { TeamLeadersRepositoryPort } from "../../../domain/interfaces/repositories/team-leaders.repository.port";

@Injectable()
export class RemoveTeamUseCase {
	constructor(
		@Inject("TeamLeaderRepository")
		private teamLeaderRepository: TeamLeadersRepositoryPort,
	) {}

	execute(teamId: string, teamLeaderId: string) {
		return this.teamLeaderRepository.removeTeam(teamId, teamLeaderId);
	}
}
