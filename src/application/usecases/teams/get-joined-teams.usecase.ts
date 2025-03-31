import { Inject, Injectable } from "@nestjs/common";
import { TeamRepositoryPort } from "../../../domain/interfaces/repositories/team.repository.port";
import { Team, User } from "@prisma/client";

@Injectable()
export class GetJoinedTeamsUseCase {
	constructor(
		@Inject("TeamRepository") private teamRepository: TeamRepositoryPort,
	) {}

	execute(user: User): Promise<Team[]> {
		return this.teamRepository.getJoinedTeam(user);
	}
}
