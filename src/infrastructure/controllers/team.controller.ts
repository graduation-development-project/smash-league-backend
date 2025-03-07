import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Query,
	Req,
	UseGuards,
} from "@nestjs/common";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { GetTeamMembersUseCase } from "../../application/usecases/teams/get-team-members.usecase";
import {
	IPaginatedOutput,
	IPaginateOptions,
	IRequestUser,
} from "../../domain/interfaces/interfaces";
import { Team, User } from "@prisma/client";
import { GetTeamDetailUseCase } from "../../application/usecases/teams/get-team-detail.usecase";
import { GetJoinedTeamsUseCase } from "../../application/usecases/teams/get-joined-teams.usecase";
import { GetTeamListUseCase } from "../../application/usecases/teams/get-team-list.usecase";
import { SearchTeamsUseCase } from "../../application/usecases/teams/search-teams.usecase";
import * as sea from "node:sea";

@Controller("/teams")
export class TeamController {
	constructor(
		private getTeamMembersUseCase: GetTeamMembersUseCase,
		private getTeamDetailUseCase: GetTeamDetailUseCase,
		private getJoinedTeamsUseCase: GetJoinedTeamsUseCase,
		private getTeamListUseCase: GetTeamListUseCase,
		private searchTeamsUseCase: SearchTeamsUseCase,
	) {}

	@Get("/")
	@HttpCode(HttpStatus.OK)
	getTeamList(
		@Query() paginateOption: IPaginateOptions,
	): Promise<IPaginatedOutput<Team>> {
		return this.getTeamListUseCase.execute(paginateOption);
	}

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

	@Get("/search")
	@HttpCode(HttpStatus.OK)
	searchTeams(
		@Query("searchTerm") searchTerm: string,
		@Query() paginateOption: IPaginateOptions,
	): Promise<IPaginatedOutput<Team>> {
		return this.searchTeamsUseCase.execute(searchTerm, paginateOption);
	}

	@Get("/:teamId")
	@HttpCode(HttpStatus.OK)
	getTeamDetail(@Param("teamId") teamId: string): Promise<Team> {
		return this.getTeamDetailUseCase.execute(teamId);
	}
}
