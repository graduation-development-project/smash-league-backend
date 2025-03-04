import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Req,
	UseGuards,
} from "@nestjs/common";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { GetTeamMembersUseCase } from "../../application/usecases/teams/get-team-members.usecase";
import { IRequestUser } from "../../domain/interfaces/interfaces";
import { Team, User } from "@prisma/client";
import { GetTeamDetailUseCase } from "../../application/usecases/teams/get-team-detail.usecase";
import { GetJoinedTeamsUseCase } from "../../application/usecases/teams/get-joined-teams.usecase";

@Controller("/teams")
export class TeamController {
	constructor(
		private getTeamMembersUseCase: GetTeamMembersUseCase,
		private getTeamDetailUseCase: GetTeamDetailUseCase,
		private getJoinedTeamsUseCase: GetJoinedTeamsUseCase,
	) {}

	@Get("/members/:teamId")
	@HttpCode(HttpStatus.OK)
	getTeamMembers(@Param("teamId") teamId: string): Promise<User[]> {
		return this.getTeamMembersUseCase.execute(teamId);
	}

	@Get("/joined-team")
	@UseGuards(JwtAccessTokenGuard)
	@HttpCode(HttpStatus.OK)
	getJoinedTeam(@Req() { user }: IRequestUser): Promise<Team[]> {
		return this.getJoinedTeamsUseCase.execute(user);
	}

	@Get("/:teamId")
	@HttpCode(HttpStatus.OK)
	getTeamDetail(@Param("teamId") teamId: string): Promise<Team> {
		return this.getTeamDetailUseCase.execute(teamId);
	}
}
