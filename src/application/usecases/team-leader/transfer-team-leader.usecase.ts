import { Inject, Injectable } from "@nestjs/common";
import { TeamLeadersRepositoryPort } from "../../../domain/repositories/team-leaders.repository.port";
import { TransferTeamLeaderRoleDTO } from "../../../domain/dtos/team-leaders/transfer-team-leader-role.dto";

@Injectable()
export class TransferTeamLeaderUseCase {
	constructor(
		@Inject("TeamLeaderRepository")
		private teamLeaderRepository: TeamLeadersRepositoryPort,
	) {}

	execute(transferTeamLeaderRoleDTO: TransferTeamLeaderRoleDTO) {
		return this.teamLeaderRepository.transferTeamLeaderRole(
			transferTeamLeaderRoleDTO,
		);
	}
}
