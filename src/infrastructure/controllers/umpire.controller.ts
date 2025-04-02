import {
	Body,
	Controller,
	Get,
	Put,
	Req,
	Param,
	UseGuards,
} from "@nestjs/common";
import { UmpireUpdateMatchDTO } from "../../domain/dtos/umpire/umpire-update-match.dto";
import { UmpireUpdateMatchUseCase } from "../../application/usecases/umpires/umpire-update-match.usecase";
import { ApiResponse } from "../../domain/dtos/api-response";
import { IRequestUser } from "../../domain/interfaces/interfaces";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { Match } from "@prisma/client";
import { GetAssignedMatchUseCase } from "../../application/usecases/umpires/get-assigned-match.usecase";

@Controller("/umpires")
@UseGuards(JwtAccessTokenGuard, RolesGuard)
@Roles(RoleMap.Umpire.name)
export class UmpireController {
	constructor(
		private umpireUpdateMatchUseCase: UmpireUpdateMatchUseCase,
		private getAssignedMatchUseCase: GetAssignedMatchUseCase,
	) {}

	@Put("/update-match")
	async updateMatch(
		@Body() umpireUpdateMatchDTO: UmpireUpdateMatchDTO,
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<null>> {
		return this.umpireUpdateMatchUseCase.execute({
			...umpireUpdateMatchDTO,
			user,
		});
	}

	@Get("/assigned-matches/:tournamentId")
	async getAssignedMatches(
		@Req() { user }: IRequestUser,
		@Param("tournamentId") tournamentId: string,
	): Promise<ApiResponse<Match[]>> {
		return this.getAssignedMatchUseCase.execute(user.id, tournamentId);
	}
}
