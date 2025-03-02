import {
	Body,
	Controller,
	Post,
	Put,
	Req,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { CreateTeamDTO } from "../../domain/dtos/team-leaders/create-team.dto";
import { CreateTeamUseCase } from "../../application/usecases/team-leader/create-team.usecase";
import { Team } from "@prisma/client";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { SendTeamInvitationUseCase } from "../../application/usecases/team-leader/send-team-invitation.usecase";
import { Send } from "express";
import { SendInvitationDTO } from "../../domain/dtos/team-leaders/send-invitation.dto";
import { IRequestUser } from "../../domain/interfaces/interfaces";
import { RemoveTeamUseCase } from "../../application/usecases/team-leader/remove-team.usecase";
import { EditTeamDTO } from "../../domain/dtos/team-leaders/edit-team.dto";
import { EditTeamUseCase } from "../../application/usecases/team-leader/edit-team.usecase";
import { RemoveTeamMemberDTO } from "../../domain/dtos/team-leaders/remove-team-member.dto";
import { RemoveTeamMemberUseCase } from "../../application/usecases/team-leader/remove-team-member.usecase";
import { ResponseLeaveTeamRequestUseCase } from "../../application/usecases/team-leader/response-leave-team-request.usecase";
import { ResponseLeaveTeamRequestDTO } from "../../domain/dtos/team-leaders/response-leave-team-request.dto";
import { ResponseJoinTeamRequestUseCase } from "../../application/usecases/team-leader/response-join-team-request.usecase";

@Controller("/team-leaders")
@UseGuards(JwtAccessTokenGuard, RolesGuard)
@Roles(RoleMap.Team_Leader.name)
export class TeamLeaderController {
	constructor(
		private createTeamUseCase: CreateTeamUseCase,
		private sendTeamInvitationUseCase: SendTeamInvitationUseCase,
		private removeTeamUseCase: RemoveTeamUseCase,
		private editTeamUseCase: EditTeamUseCase,
		private removeTeamMemberUseCase: RemoveTeamMemberUseCase,
		private responseLeaveTeamRequestUseCase: ResponseLeaveTeamRequestUseCase,
		private responseJoinTeamRequestUseCase: ResponseJoinTeamRequestUseCase,
	) {}

	@Post("/create-team")
	@Roles(RoleMap.Team_Leader.name, RoleMap.Athlete.name)
	@UseInterceptors(AnyFilesInterceptor())
	async createTeam(
		@Body()
		{ teamName, description }: { teamName: string; description: string },
		@UploadedFiles() logo: Express.Multer.File[],
		@Req() { user }: IRequestUser,
	): Promise<Team> {
		return this.createTeamUseCase.execute({
			teamLeader: user,
			teamName,
			description,
			logo,
		});
	}

	@Post("/send-invitation")
	async sendTeamInvitation(
		@Body() sendInvitationDTO: SendInvitationDTO,
	): Promise<string> {
		return this.sendTeamInvitationUseCase.execute(sendInvitationDTO);
	}

	@Put("/remove-team")
	async removeTeam(
		@Body("teamId") teamId: string,
		@Req() { user }: IRequestUser,
	): Promise<string> {
		return this.removeTeamUseCase.execute(teamId, user.id);
	}

	@Put("edit-team")
	@UseInterceptors(AnyFilesInterceptor())
	editTeam(
		@Body() editTeamDTO: EditTeamDTO,
		@UploadedFiles() logo: Express.Multer.File[],
		@Req() { user }: IRequestUser,
	): Promise<Team> {
		return this.editTeamUseCase.execute({
			...editTeamDTO,
			teamLeaderId: user.id,
			logo,
		});
	}

	@Put("remove-team-members")
	removeTeamMember(
		@Body() removeTeamMemberDTO: RemoveTeamMemberDTO,
		@Req() { user }: IRequestUser,
	): Promise<string> {
		return this.removeTeamMemberUseCase.execute({
			...removeTeamMemberDTO,
			teamLeaderId: user.id,
		});
	}

	@Put("response-leave-team-request")
	responseLeaveTeamRequest(
		@Body() responseLeaveTeamRequestDTO: ResponseLeaveTeamRequestDTO,
		@Req() { user }: IRequestUser,
	): Promise<string> {
		return this.responseLeaveTeamRequestUseCase.execute({
			...responseLeaveTeamRequestDTO,
			user,
		});
	}

	@Put("response-join-team-request")
	responseJoinTeamRequest(
		@Body() responseJoinTeamRequestDTO: ResponseLeaveTeamRequestDTO,
		@Req() { user }: IRequestUser,
	): Promise<string> {
		return this.responseJoinTeamRequestUseCase.execute({
			...responseJoinTeamRequestDTO,
			user,
		});
	}
}
