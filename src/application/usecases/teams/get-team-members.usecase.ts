import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TeamRepositoryPort } from "../../../domain/repositories/team.repository.port";
import { User } from "@prisma/client";
import {
	IPaginatedOutput,
	IPaginateOptions,
} from "../../../domain/interfaces/interfaces";
import { ApiResponse } from "../../../domain/dtos/api-response";

@Injectable()
export class GetTeamMembersUseCase {
	constructor(
		@Inject("TeamRepository") private teamRepository: TeamRepositoryPort,
	) {}

	async execute(
		options: IPaginateOptions,
		teamId: string,
		searchTerm?: string,
	): Promise<ApiResponse<IPaginatedOutput<User>>> {
		return new ApiResponse<IPaginatedOutput<User>>(
			HttpStatus.OK,
			"Search Team Members Successfully",
			await this.teamRepository.searchTeamMember(options, teamId, searchTerm),
		);
	}
}
