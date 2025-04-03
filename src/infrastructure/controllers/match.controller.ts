import { Controller, Get, Param, Put, Query, UseGuards } from "@nestjs/common";
import { UpdateAttendanceUseCase } from "src/application/usecases/tournament/match/update-attendance.usecase";
import { UpdateForfeitCompetitorUseCase } from "src/application/usecases/tournament/match/update-forfeit-competitor.usecase,";
import { ApiResponse } from "src/domain/dtos/api-response";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { StartMatchUseCase } from "src/application/usecases/tournament/match/start-match.usecase";
import { Court, Game, Match } from "@prisma/client";
import { UpdatePointUseCase } from "src/application/usecases/tournament/match/update-point.usecase";
import { GetCourtAvailableUseCase } from "src/application/usecases/tournament/court/get-court-available.usecase";
import { AssignCourtForMatchUseCase } from "src/application/usecases/tournament/court/assign-court-for-match.usecase";
import { GetMatchByIdUseCase } from "src/application/usecases/tournament/match/get-match-by-id.usecase";
import { IMatchQueryResponse } from "src/domain/interfaces/tournament/match/match.query";

@Controller("match")
export class MatchController {
	constructor(
		private readonly updateAttendanceUseCase: UpdateAttendanceUseCase,
		private readonly updateForfeitCompetitorUseCase: UpdateForfeitCompetitorUseCase,
		private readonly startMatchUseCase: StartMatchUseCase,
		private readonly updatePointUseCase: UpdatePointUseCase,
		private readonly getCourtsAvailableUseCase: GetCourtAvailableUseCase,
		private readonly assignCourtForMatchUseCase: AssignCourtForMatchUseCase,
		private readonly getMatchByIdUseCase: GetMatchByIdUseCase
	) {
	}

	@Get("get-match/:matchId")
	async getMatchById(@Param("matchId") matchId: string): Promise<ApiResponse<IMatchQueryResponse>> {
		return await this.getMatchByIdUseCase.execute(matchId);
	}

	@Put("update-attendance/:matchId")
	// @UseGuards(JwtAccessTokenGuard, RolesGuard)
	// @Roles(RoleMap.Umpire.name)
	async updateAttendance(
		@Param("matchId") matchId: string,
		@Query("leftCompetitorAttendance") leftCompetitorAttendance: boolean,
		@Query("rightCompetitorAttendance") rightCompetitorAttendance: boolean): Promise<ApiResponse<any>> {
			// console.log(leftCompetitorAttendance, ' ', rightCompetitorAttendance);
			// return;
			return await this.updateAttendanceUseCase.execute(matchId, leftCompetitorAttendance, rightCompetitorAttendance);
		} 
	
	@Put("update-start-time/:matchId")
	async updateStartTimeForMatch(@Param("matchId") matchId: string, @Query("currentServerId") currentServerId: string): Promise<ApiResponse<Game>> {
		console.log(currentServerId);
		return await this.startMatchUseCase.execute(matchId, currentServerId);
	}	

	@Put("update-point/:gameId")
	async updatePointOfGame(@Param("gameId") gameId: string,
				@Query("winningId") winningId: string): Promise<ApiResponse<any>> {
					// console.log(gameId);
					return await this.updatePointUseCase.execute(gameId, winningId);
				}				

	@Get("get-courts-available/:tournamentId")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async getCourtsAvailable(@Param("tournamentId") tournamentId: string): Promise<ApiResponse<Court[]>> {
		return await this.getCourtsAvailableUseCase.execute(tournamentId);
	}			

	@Get("assign-court-for-match")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async assignCourtForMatch(@Query("matchId") matchId: string, @Query("courtId") courtId: string): Promise<ApiResponse<Match>> {
		return await this.assignCourtForMatchUseCase.execute(matchId, courtId);
	}
}