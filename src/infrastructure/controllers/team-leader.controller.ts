import {
	Body,
	Controller,
	Post,
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

@Controller("/team-leaders")
@UseGuards(JwtAccessTokenGuard, RolesGuard)
@Roles(RoleMap.Team_Leader.name)
export class TeamLeaderController {
	constructor(
		private createTeamUseCase: CreateTeamUseCase,
		private sendTeamInvitationUseCase: SendTeamInvitationUseCase,
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
			teamLeaderId: user.id,
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
}
