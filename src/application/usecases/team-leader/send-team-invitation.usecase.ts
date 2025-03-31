import { Inject, Injectable } from "@nestjs/common";
import { TeamLeadersRepositoryPort } from "../../../domain/interfaces/repositories/team-leaders.repository.port";
import { SendInvitationDTO } from "../../../domain/dtos/team-leaders/send-invitation.dto";

@Injectable()
export class SendTeamInvitationUseCase {
	constructor(
		@Inject("TeamLeaderRepository")
		private teamLeaderRepository: TeamLeadersRepositoryPort,
	) {}

	execute(sendInvitationDTO: SendInvitationDTO) {
		return this.teamLeaderRepository.sendTeamInvitation(sendInvitationDTO);
	}
}
