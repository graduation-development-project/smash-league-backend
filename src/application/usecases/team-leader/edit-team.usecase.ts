import { Inject, Injectable } from "@nestjs/common";
import { TeamLeadersRepositoryPort } from "../../../domain/repositories/team-leaders.repository.port";
import { EditTeamDTO } from "../../../domain/dtos/team-leaders/edit-team.dto";
import { Team } from "@prisma/client";

@Injectable()
export class EditTeamUseCase {
	constructor(
		@Inject("TeamLeaderRepository")
		private teamLeaderRepository: TeamLeadersRepositoryPort,
	) {}

	execute(editTeamDTO: EditTeamDTO): Promise<Team> {
		return this.teamLeaderRepository.editTeam(editTeamDTO);
	}
}
