import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TeamRepositoryPort } from "../../../domain/repositories/team.repository.port";
import { User } from "@prisma/client";
import { ApiResponse } from "../../../domain/dtos/api-response";

@Injectable()
export class GetTeamMembersByTeamLeaderUseCase {
	constructor(
		@Inject("TeamRepository") private teamRepository: TeamRepositoryPort,
	) {}

	async execute(organizerId: string): Promise<ApiResponse<User[]>> {
		return new ApiResponse<User[]>(
			HttpStatus.OK,
			"Get Team Members By Organizer Successfully",
			await this.teamRepository.getTeamMemberByOrganizerId(organizerId),
		);
	}
}
