import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TeamLeadersRepositoryPort } from "../../../domain/repositories/team-leaders.repository.port";
import { TransferTeamLeaderRoleDTO } from "../../../domain/dtos/team-leaders/transfer-team-leader-role.dto";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { TeamRequest, TournamentRegistration } from "@prisma/client";
import { RegisterTournamentForTeamDTO } from "../../../domain/dtos/team-leaders/register-tournament-for-team.dto";

@Injectable()
export class RegisterTournamentForTeamUseCase {
	constructor(
		@Inject("TeamLeaderRepository")
		private teamLeaderRepository: TeamLeadersRepositoryPort,
	) {}

	async execute(
		registerTournamentForTeamDTO: RegisterTournamentForTeamDTO[],
	): Promise<ApiResponse<TournamentRegistration[]>> {
		return new ApiResponse<TournamentRegistration[]>(
			HttpStatus.CREATED,
			"Register tournament for team successfully",
			await this.teamLeaderRepository.registerTournamentForTeam(
				registerTournamentForTeamDTO,
			),
		);
	}
}
