import { Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { UpdateAttendanceUseCase } from "src/application/usecases/tournament/match/update-attendance.usecase";
import { UpdateForfeitCompetitorUseCase } from "src/application/usecases/tournament/match/update-forfeit-competitor.usecase,";
import { ApiResponse } from "src/domain/dtos/api-response";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { StartMatchUseCase } from "src/application/usecases/tournament/match/start-match.usecase";
import { Match } from "@prisma/client";

@Controller("match")
export class MatchController {
	constructor(
		private readonly updateAttendanceUseCase: UpdateAttendanceUseCase,
		private readonly updateForfeitCompetitorUseCase: UpdateForfeitCompetitorUseCase,
		private readonly startMatchUseCase: StartMatchUseCase
	) {
	}

	@Put("update-attendance/:matchId")
	// @UseGuards(JwtAccessTokenGuard, RolesGuard)
	// @Roles(RoleMap.Umpire.name)
	async updateAttendance(
		@Param("matchId") matchId: string,
		@Param("leftCompetitorAttendance") leftCompetitorAttendance: boolean,
		@Param("rightCompetitorAttendance") rightCompetitorAttendance: boolean): Promise<ApiResponse<any>> {
			return await this.updateAttendance(matchId, leftCompetitorAttendance, rightCompetitorAttendance);
		} 
	
	@Put("update-start-time/:matchId")
	async updateStartTimeForMatch(@Param("matchId") matchId: string): Promise<ApiResponse<Match>> {
		return await this.startMatchUseCase.execute(matchId);
	}	
}