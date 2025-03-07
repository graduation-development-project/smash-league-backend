import { Inject, Injectable } from "@nestjs/common";
import { TeamRepositoryPort } from "../../../domain/repositories/team.repository.port";
import {
	IPaginatedOutput,
	IPaginateOptions,
} from "../../../domain/interfaces/interfaces";
import { Team } from "@prisma/client";

@Injectable()
export class SearchTeamsUseCase {
	constructor(
		@Inject("TeamRepository") private teamRepository: TeamRepositoryPort,
	) {}

	execute(
		searchTerm: string,
		options: IPaginateOptions,
	): Promise<IPaginatedOutput<Team>> {
		return this.teamRepository.searchTeams(searchTerm, options);
	}
}
