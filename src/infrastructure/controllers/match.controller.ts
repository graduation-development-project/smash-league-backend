import { Controller, Get, Param, Put, Query, UseGuards } from "@nestjs/common";
import { UpdateAttendanceUseCase } from "src/application/usecases/tournament/match/update-attendance.usecase";
import { UpdateForfeitCompetitorUseCase } from "src/application/usecases/tournament/match/update-forfeit-competitor.usecase,";
import { ApiResponse } from "src/domain/dtos/api-response";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { StartMatchUseCase } from "src/application/usecases/tournament/match/start-match.usecase";
import { Game, Match } from "@prisma/client";
import { UpdatePointUseCase } from "src/application/usecases/tournament/match/update-point.usecase";

@Controller("match")
export class MatchController {
	constructor(
		private readonly updateAttendanceUseCase: UpdateAttendanceUseCase,
		private readonly updateForfeitCompetitorUseCase: UpdateForfeitCompetitorUseCase,
		private readonly startMatchUseCase: StartMatchUseCase,
		private readonly updatePointUseCase: UpdatePointUseCase
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
	async updateStartTimeForMatch(@Param("matchId") matchId: string, @Query("currentServerId") currentServerId: string): Promise<ApiResponse<Game>> {
		console.log(currentServerId);
		return await this.startMatchUseCase.execute(matchId, currentServerId);
	}	

	@Put("update-point/:gameId")
	async updatePointOfGame(@Param("gameId") gameId: string,
				@Query("winningId") winningId: string): Promise<ApiResponse<any>> {
					console.log(gameId);
					return await this.updatePointUseCase.execute(gameId, winningId);
				}				
}