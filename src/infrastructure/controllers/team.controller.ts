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
// import { GetTeamListUseCase } from "../../application/usecases/teams/get-team-list.usecase";
import { SearchTeamsUseCase } from "../../application/usecases/teams/search-teams.usecase";
import * as sea from "node:sea";
import { ApiResponse } from "../../domain/dtos/api-response";
import {
	GetTeamMembersByTeamLeaderUseCase
} from "../../application/usecases/teams/get-team-members-by-team-leader.usecase";

@Controller("/teams")
export class TeamController {
	constructor(
		private getTeamMembersUseCase: GetTeamMembersUseCase,
		private getTeamDetailUseCase: GetTeamDetailUseCase,
		private getJoinedTeamsUseCase: GetJoinedTeamsUseCase,
		// private getTeamListUseCase: GetTeamListUseCase,
		private searchTeamsUseCase: SearchTeamsUseCase,
		private getTeamMembersByTeamLeaderUseCase: GetTeamMembersByTeamLeaderUseCase,
	) {}

	// @Get("/")
	// @HttpCode(HttpStatus.OK)
	// getTeamList(
	// 	@Query() paginateOption: IPaginateOptions,
	// ): Promise<IPaginatedOutput<Team>> {
	// 	return this.getTeamListUseCase.execute(paginateOption);
	// }

	@Get("/members/:teamId")
	@HttpCode(HttpStatus.OK)
	getTeamMembers(
		@Param("teamId") teamId: string,
		@Query() paginateOption: IPaginateOptions,
		@Query("searchTerm") searchTerm?: string,
	): Promise<ApiResponse<IPaginatedOutput<User>>> {
		return this.getTeamMembersUseCase.execute(
			paginateOption,
			teamId,
			searchTerm,
		);
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
		@Query() paginateOption: IPaginateOptions,
		@Query("searchTerm") searchTerm?: string,
	): Promise<IPaginatedOutput<Team & { teamLeader: User }>> {
		return this.searchTeamsUseCase.execute(paginateOption, searchTerm);
	}

	@Get("/memberList/")
	@UseGuards(JwtAccessTokenGuard)
	@HttpCode(HttpStatus.OK)
	getTeamMembersByOrganizer(
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<User[]>> {
		return this.getTeamMembersByTeamLeaderUseCase.execute(user.id);
	}

	@Get("/:teamId")
	@HttpCode(HttpStatus.OK)
	getTeamDetail(@Param("teamId") teamId: string): Promise<Team> {
		return this.getTeamDetailUseCase.execute(teamId);
	}


}
