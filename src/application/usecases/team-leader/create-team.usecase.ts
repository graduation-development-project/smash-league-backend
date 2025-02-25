import { Inject, Injectable } from "@nestjs/common";
import { TeamLeadersRepositoryPort } from "../../../domain/repositories/team-leaders.repository.port";
import { CreateTeamDTO } from "../../../domain/dtos/team-leaders/create-team.dto";
import { Team } from "@prisma/client";

@Injectable()
export class CreateTeamUseCase {
	constructor(
		@Inject("TeamLeaderRepository")
		private teamLeaderRepository: TeamLeadersRepositoryPort,
	) {}

	execute(createTeamDTO: CreateTeamDTO): Promise<Team> {
		return this.teamLeaderRepository.createTeam(createTeamDTO);
	}
}
