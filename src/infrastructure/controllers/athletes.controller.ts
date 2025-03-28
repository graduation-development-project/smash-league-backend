import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	Query,
	Req,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { RegisterTournamentDTO } from "../../domain/dtos/athletes/register-tournament.dto";
import { RegisterTournamentUseCase } from "../../application/usecases/athletes/register-tournament.usecase";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import {
	Tournament,
	TournamentRegistration,
	UserVerification,
} from "@prisma/client";
import { GetParticipatedTournamentsUseCase } from "../../application/usecases/athletes/get-participated-tournaments.usecase";
import {
	IPaginatedOutput,
	IPaginateOptions,
	IRequestUser,
} from "../../domain/interfaces/interfaces";
import { RegisterNewRoleUseCase } from "../../application/usecases/athletes/register-new-role.usecase";
import { RegisterNewRoleDTO } from "../../domain/dtos/athletes/register-new-role.dto";
import { TUserWithRole } from "../types/users.type";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
// import { UploadVerificationImagesUseCase } from "../../application/usecases/athletes/upload-verification-images.usecase";
import { TCloudinaryResponse } from "../types/cloudinary.type";
import { ResponseToTeamInvitationDTO } from "../../domain/dtos/athletes/response-to-team-invitation.dto";
import { ResponseToTeamInvitationUseCase } from "../../application/usecases/athletes/response-to-team-invitation.usecase";
import { LeaveTeamUseCase } from "../../application/usecases/athletes/leave-team.usecase";
import { LeaveTeamDTO } from "../../domain/dtos/athletes/leave-team.dto";
import { RequestJoinTeamUseCase } from "../../application/usecases/athletes/request-join-team.usecase";
import { RequestJoinTeamDTO } from "../../domain/dtos/athletes/request-join-team.dto";
import { ResponseTeamLeaderTransferDTO } from "../../domain/dtos/athletes/response-team-leader-transfer.dto";
import { ResponseTransferTeamLeaderUseCase } from "../../application/usecases/athletes/response-transfer-team-leader.usecase";
import { ApiResponse } from "../../domain/dtos/api-response";
import { IParticipatedTournamentResponse } from "../../domain/interfaces/tournament/tournament.interface";

@Controller("/athletes")
@UseGuards(JwtAccessTokenGuard, RolesGuard)
@Roles(RoleMap.Athlete.name)
export class AthletesController {
	constructor(
		private registerTournamentUseCase: RegisterTournamentUseCase,
		private getParticipatedTournamentsUseCase: GetParticipatedTournamentsUseCase,
		private registerNewRoleUseCase: RegisterNewRoleUseCase,
		private responseToTeamInvitationUseCase: ResponseToTeamInvitationUseCase,
		private leaveTeamUseCase: LeaveTeamUseCase,
		private requestJoinTeamUseCase: RequestJoinTeamUseCase,
		private responseTransferTeamLeaderUseCase: ResponseTransferTeamLeaderUseCase,
		// private uploadVerificationImagesUseCase: UploadVerificationImagesUseCase,
	) {}

	@UseInterceptors(AnyFilesInterceptor())
	@Post("register-tournament")
	registerTournament(
		@Body() registerTournamentDTO: RegisterTournamentDTO,
		@Req() { user }: IRequestUser,
		@UploadedFiles() files: Express.Multer.File[],
	): Promise<ApiResponse<TournamentRegistration>> {
		return this.registerTournamentUseCase.execute({
			...registerTournamentDTO,
			user,
			files,
		});
	}

	@Get("participated-tournament")
	getParticipatedTournaments(
		@Req() { user }: IRequestUser,
		@Query() paginateOption: IPaginateOptions,
		@Query("status") tournamentStatus: string,
	): Promise<ApiResponse<IPaginatedOutput<IParticipatedTournamentResponse>>> {
		return this.getParticipatedTournamentsUseCase.execute(
			paginateOption,
			user.id,
			tournamentStatus,
		);
	}

	// @Post("upload-verification-images")
	// @UseInterceptors(AnyFilesInterceptor())
	// uploadVerificationImage(
	// 	@Req() { user }: IRequestUser,
	// 	@UploadedFiles() files: Express.Multer.File[],
	// ): Promise<TCloudinaryResponse[]> {
	// 	console.log("files", files);
	// 	return this.uploadVerificationImagesUseCase.execute(files, user.id);
	// }

	@Post("register-new-role")
	@UseInterceptors(AnyFilesInterceptor())
	registerNewRole(
		@Req() { user }: IRequestUser,
		@UploadedFiles() files: Express.Multer.File[],
		@Body() registerNewRoleDTO: RegisterNewRoleDTO,
	): Promise<ApiResponse<UserVerification>> {
		return this.registerNewRoleUseCase.execute({
			...registerNewRoleDTO,
			userId: user.id,
			files,
		});
	}

	@Post("response-team-invitation")
	responseTeamInvitation(
		@Body() responseToTeamInvitationDTO: ResponseToTeamInvitationDTO,
		@Req() { user }: IRequestUser,
	): Promise<string> {
		return this.responseToTeamInvitationUseCase.execute({
			...responseToTeamInvitationDTO,
			invitedUserId: user.id,
		});
	}

	@Post("leave-team")
	leaveTeam(
		@Req() { user }: IRequestUser,
		@Body() leaveTeamDTO: LeaveTeamDTO,
	): Promise<string> {
		return this.leaveTeamUseCase.execute({ ...leaveTeamDTO, user });
	}

	@Post("request-join-team")
	requestJoinTeam(
		@Body() requestJoinTeamDTO: RequestJoinTeamDTO,
		@Req() { user }: IRequestUser,
	): Promise<string> {
		return this.requestJoinTeamUseCase.execute({ ...requestJoinTeamDTO, user });
	}

	@Put("response-transfer-team-leader")
	responseTransferTeamLeader(
		@Body() responseTeamLeaderTransferDTO: ResponseTeamLeaderTransferDTO,
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<null>> {
		return this.responseTransferTeamLeaderUseCase.execute({
			...responseTeamLeaderTransferDTO,
			user,
		});
	}
}
