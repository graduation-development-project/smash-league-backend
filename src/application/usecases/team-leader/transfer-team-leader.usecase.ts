import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TeamLeadersRepositoryPort } from "../../../domain/interfaces/repositories/team-leaders.repository.port";
import { TransferTeamLeaderRoleDTO } from "../../../domain/dtos/team-leaders/transfer-team-leader-role.dto";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { TeamRequest } from "@prisma/client";

@Injectable()
export class TransferTeamLeaderUseCase {
	constructor(
		@Inject("TeamLeaderRepository")
		private teamLeaderRepository: TeamLeadersRepositoryPort,
	) {}

	async execute(
		transferTeamLeaderRoleDTO: TransferTeamLeaderRoleDTO,
	): Promise<ApiResponse<TeamRequest>> {
		return new ApiResponse(
			HttpStatus.CREATED,
			"Send notification for transfer team leader successfully",
			await this.teamLeaderRepository.transferTeamLeaderRole(
				transferTeamLeaderRoleDTO,
			),
		);
	}
}
