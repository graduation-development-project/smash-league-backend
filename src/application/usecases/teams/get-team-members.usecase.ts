import { Inject, Injectable } from "@nestjs/common";
import { TeamRepositoryPort } from "../../../domain/repositories/team.repository.port";
import { User } from "@prisma/client";

@Injectable()
export class GetTeamMembersUseCase {
	constructor(
		@Inject("TeamRepository") private teamRepository: TeamRepositoryPort,
	) {}

	execute(teamId: string): Promise<User[]> {
		return this.teamRepository.getTeamMemberByTeamId(teamId);
	}
}
