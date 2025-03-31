import { Inject, Injectable } from "@nestjs/common";
import { TeamRepositoryPort } from "../../../domain/interfaces/repositories/team.repository.port";
import { Team } from "@prisma/client";

@Injectable()
export class GetTeamDetailUseCase {
	constructor(
		@Inject("TeamRepository") private teamRepository: TeamRepositoryPort,
	) {}

	execute(teamId: string): Promise<Team> {
		return this.teamRepository.getTeamDetails(teamId);
	}
}
