import { RegisterTournamentDTO } from "../dtos/athletes/register-tournament.dto";
import {
	Tournament,
	TournamentRegistration,
	UserVerification,
} from "@prisma/client";
import { RegisterNewRoleDTO } from "../dtos/athletes/register-new-role.dto";
import { ResponseToTeamInvitationDTO } from "../dtos/athletes/response-to-team-invitation.dto";
import { LeaveTeamDTO } from "../dtos/athletes/leave-team.dto";
import { RequestJoinTeamDTO } from "../dtos/athletes/request-join-team.dto";

export interface AthletesRepositoryPort {
	registerTournament(
		registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentRegistration>;

	getParticipatedTournaments(
		userID: string,
		tournamentStatus: string,
	): Promise<Tournament[]>;

	// uploadVerificationImage(
	// 	files: Express.Multer.File[],
	// 	userID: string,
	// ): Promise<TCloudinaryResponse[]>;

	registerNewRole(
		registerNewRoleDTO: RegisterNewRoleDTO,
	): Promise<UserVerification>;

	responseToTeamInvitation(
		responseToTeamInvitationDTO: ResponseToTeamInvitationDTO,
	): Promise<string>;

	leaveTeam(leaveTeamDTO: LeaveTeamDTO): Promise<string>;

	requestJoinTeam(requestJoinTeamDTO: RequestJoinTeamDTO): Promise<string>;
}
