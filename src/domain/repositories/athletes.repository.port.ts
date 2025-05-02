import { RegisterTournamentDTO } from "../dtos/athletes/register-tournament.dto";
import {
	Tournament,
	TournamentRegistration, TournamentStatus,
	UserVerification,
} from "@prisma/client";
import { RegisterNewRoleDTO } from "../dtos/athletes/register-new-role.dto";
import { ResponseToTeamInvitationDTO } from "../dtos/athletes/response-to-team-invitation.dto";
import { LeaveTeamDTO } from "../dtos/athletes/leave-team.dto";
import { RequestJoinTeamDTO } from "../dtos/athletes/request-join-team.dto";
import { ResponseTeamLeaderTransferDTO } from "../dtos/athletes/response-team-leader-transfer.dto";
import { IPaginatedOutput, IPaginateOptions } from "../interfaces/interfaces";
import { IParticipatedTournamentResponse } from "../interfaces/tournament/tournament.interface";

export interface AthletesRepositoryPort {
	registerTournament(
		registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentRegistration>;

	getParticipatedTournaments(
		options: IPaginateOptions,
		userID: string,
		tournamentStatus: TournamentStatus,
	): Promise<IPaginatedOutput<IParticipatedTournamentResponse>>;

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

	responseToTransferTeamLeader(
		responseToTransferTeamLeaderDTO: ResponseTeamLeaderTransferDTO,
	): Promise<string>;

	getTournamentRegistrationByUserId(
		userID: string,
	): Promise<TournamentRegistration[]>;
}
