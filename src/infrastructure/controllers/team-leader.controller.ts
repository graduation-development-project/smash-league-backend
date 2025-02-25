import {
	Body,
	Controller,
	Post,
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
import {Send} from "express";
import {SendInvitationDTO} from "../../domain/dtos/team-leaders/send-invitation.dto";

@Controller("/team-leaders")
@UseGuards(JwtAccessTokenGuard, RolesGuard)
@Roles(RoleMap.Team_Leader.name)
export class TeamLeaderController {
	constructor(
		private createTeamUseCase: CreateTeamUseCase,
		private sendTeamInvitationUseCase: SendTeamInvitationUseCase,
	) {}

	@Post("/create-team")
	@UseInterceptors(AnyFilesInterceptor())
	async createTeam(
		@Body() createTeamDTO: CreateTeamDTO,
		@UploadedFiles() logo: Express.Multer.File[],
	): Promise<Team> {
		return this.createTeamUseCase.execute({ ...createTeamDTO, logo });
	}

	@Post("/send-invitation")
	async sendTeamInvitation(
		@Body() sendInvitationDTO: SendInvitationDTO,
	): Promise<string> {
		return this.sendTeamInvitationUseCase.execute(sendInvitationDTO)
	}
}
