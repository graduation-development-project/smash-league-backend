import { Inject, Injectable } from "@nestjs/common";
import { TeamRepositoryPort } from "../../../domain/repositories/team.repository.port";
import {
	IPaginatedOutput,
	IPaginateOptions,
} from "../../../domain/interfaces/interfaces";
import {Team, User} from "@prisma/client";

@Injectable()
export class SearchTeamsUseCase {
	constructor(
		@Inject("TeamRepository") private teamRepository: TeamRepositoryPort,
	) {}

	execute(
		options: IPaginateOptions,
		searchTerm?: string,
	): Promise<IPaginatedOutput<Team & { teamLeader: User }>> {
		return this.teamRepository.searchTeams(options, searchTerm);
	}
}
