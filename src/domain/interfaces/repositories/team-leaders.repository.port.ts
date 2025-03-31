import {Team, TeamRequest} from "@prisma/client";
import { SendInvitationDTO } from "../../dtos/team-leaders/send-invitation.dto";
import { CreateTeamDTO } from "../../dtos/team-leaders/create-team.dto";
import { EditTeamDTO } from "../../dtos/team-leaders/edit-team.dto";
import { RemoveTeamMemberDTO } from "../../dtos/team-leaders/remove-team-member.dto";
import { ResponseLeaveTeamRequestDTO } from "../../dtos/team-leaders/response-leave-team-request.dto";
import { TransferTeamLeaderRoleDTO } from "../../dtos/team-leaders/transfer-team-leader-role.dto";

export interface TeamLeadersRepositoryPort {
	createTeam(createTeamDTO: CreateTeamDTO): Promise<Team>;

	sendTeamInvitation(sendInvitationDTO: SendInvitationDTO): Promise<string>;

	removeTeam(teamId: string, teamLeaderId: string): Promise<string>;

	editTeam(editTeamDTO: EditTeamDTO): Promise<Team>;

	removeTeamMember(removeTeamMemberDTO: RemoveTeamMemberDTO): Promise<string>;

	responseLeaveTeamRequest(
		responseLeaveTeamRequest: ResponseLeaveTeamRequestDTO,
	): Promise<string>;

	responseJoinTeamRequest(
		responseJoinTeamRequest: ResponseLeaveTeamRequestDTO,
	): Promise<string>;

	transferTeamLeaderRole(
		transferTeamLeaderRoleDTO: TransferTeamLeaderRoleDTO,
	): Promise<TeamRequest>;
}
