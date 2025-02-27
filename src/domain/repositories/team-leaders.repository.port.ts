import { Team } from "@prisma/client";
import { SendInvitationDTO } from "../dtos/team-leaders/send-invitation.dto";
import { CreateTeamDTO } from "../dtos/team-leaders/create-team.dto";
import {EditTeamDTO} from "../dtos/team-leaders/edit-team.dto";

export interface TeamLeadersRepositoryPort {
	createTeam(createTeamDTO: CreateTeamDTO): Promise<Team>;

	sendTeamInvitation(sendInvitationDTO: SendInvitationDTO): Promise<string>;

	removeTeam(teamId: string, teamLeaderId: string): Promise<string>;

	editTeam(editTeamDTO: EditTeamDTO): Promise<Team>;
}
