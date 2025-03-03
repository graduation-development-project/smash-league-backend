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
import { User } from "@prisma/client";

@Controller("/teams")
@UseGuards(JwtAccessTokenGuard)
export class TeamController {
	constructor(private getTeamMembersUseCase: GetTeamMembersUseCase) {}

	@Get("/:teamId")
	@HttpCode(HttpStatus.OK)
	getTeamMembers(
		@Param("teamId") teamId: string,
		@Req() { user }: IRequestUser,
	): Promise<User[]> {
		return this.getTeamMembersUseCase.execute(teamId, user);
	}
}
