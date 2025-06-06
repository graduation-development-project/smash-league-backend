import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Query,
	Req,
	UseGuards,
} from "@nestjs/common";
import { UpdateAttendanceUseCase } from "src/application/usecases/tournament/match/update-attendance.usecase";
import { UpdateForfeitCompetitorUseCase } from "src/application/usecases/tournament/match/update-forfeit-competitor.usecase,";
import { ApiResponse } from "src/domain/dtos/api-response";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { StartMatchUseCase } from "src/application/usecases/tournament/match/start-match.usecase";
import { Court, Game, Match, MatchLog } from "@prisma/client";
import { UpdatePointUseCase } from "src/application/usecases/tournament/match/update-point.usecase";
import { GetCourtAvailableUseCase } from "src/application/usecases/tournament/court/get-court-available.usecase";
import { AssignCourtForMatchUseCase } from "src/application/usecases/tournament/court/assign-court-for-match.usecase";
import { GetMatchByIdUseCase } from "src/application/usecases/tournament/match/get-match-by-id.usecase";
import { IMatchQueryResponse } from "src/domain/interfaces/tournament/match/match.query";
import { AssignAthleteIntoMatchUseCase } from "src/application/usecases/tournament/match/assign-athlete-into-match.usecase";
import { IRequestUser } from "../../domain/interfaces/interfaces";
import { GetMatchesOfUserUseCase } from "../../application/usecases/athletes/get-matches-of-user.usecase";
import { UpdateMatchUseCase } from "../../application/usecases/organizers/update-match.usecase";
import { UpdateMatchDTO } from "../../domain/dtos/match/update-match.dto";
import { CreateEventLogUseCase } from "src/application/usecases/tournament/match/create-event-log.usecase";
import { CreateLogEventDto } from "src/domain/dtos/match/create-log-event.dto";
import { GetAllLogMessageUseCase } from "src/application/usecases/tournament/match/get-all-log-message.usecase";
import { MatchLogDetail } from "src/domain/enums/match/match-log.enum";
import { KeyValueType } from "src/domain/dtos/key-value-type.type";
import { GetAllLogTypeUseCase } from "src/application/usecases/tournament/match/get-all-logtype.usecase";
import { GetLatestMatchesUseCase } from "../../application/usecases/athletes/get-latest-matches.usecase";
import { ContinueMatchUseCase } from "src/application/usecases/tournament/match/continue-match.usecase";
import { GetAllMatchLogUseCase } from "src/application/usecases/tournament/match/get-all-match-log.usecase";
import { SkipMatchesUseCase } from "../../application/usecases/seed/skip-matches.usecase";
import { AssignPlayerToMatchesUseCase } from "../../application/usecases/seed/assign-player-to-matches.usecase";
import { CountMatchesInCurrentWeekUseCase } from "../../application/usecases/tournament/match/count-matches-in-current-week.usecase";

@Controller("match")
export class MatchController {
	constructor(
		private readonly updateAttendanceUseCase: UpdateAttendanceUseCase,
		private readonly updateForfeitCompetitorUseCase: UpdateForfeitCompetitorUseCase,
		private readonly startMatchUseCase: StartMatchUseCase,
		private readonly updatePointUseCase: UpdatePointUseCase,
		private readonly getCourtsAvailableUseCase: GetCourtAvailableUseCase,
		private readonly assignCourtForMatchUseCase: AssignCourtForMatchUseCase,
		private readonly getMatchByIdUseCase: GetMatchByIdUseCase,
		private readonly assignAthleteIntoMatchUseCase: AssignAthleteIntoMatchUseCase,
		private readonly getMatchesOfUserUseCase: GetMatchesOfUserUseCase,
		private readonly updateMatchUseCase: UpdateMatchUseCase,
		private readonly createEventlogUseCase: CreateEventLogUseCase,
		private readonly getAllLogMessageUseCase: GetAllLogMessageUseCase,
		private readonly getAllLogTypeUseCase: GetAllLogTypeUseCase,
		private readonly continueMatchUseCase: ContinueMatchUseCase,
		private readonly getLatestMatchesUseCase: GetLatestMatchesUseCase,
		private readonly getAllMatchLogUseCase: GetAllMatchLogUseCase,
		private readonly skipMatchesUseCase: SkipMatchesUseCase,
		private readonly assignPlayerToMatchesUseCase: AssignPlayerToMatchesUseCase,
		private readonly countMatchesInCurrentWeekUseCase: CountMatchesInCurrentWeekUseCase,
	) {}

	@Get("get-match/:matchId")
	async getMatchById(
		@Param("matchId") matchId: string,
	): Promise<ApiResponse<IMatchQueryResponse>> {
		return await this.getMatchByIdUseCase.execute(matchId);
	}

	@Put("update-match-info/:matchId")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async updateMatchInfo(
		@Param("matchId") matchId: string,
		@Body() updateMatchDTO: UpdateMatchDTO,
	): Promise<ApiResponse<Match>> {
		return this.updateMatchUseCase.execute(matchId, updateMatchDTO);
	}

	@Put("update-attendance/:matchId")
	// @UseGuards(JwtAccessTokenGuard, RolesGuard)
	// @Roles(RoleMap.Umpire.name)
	async updateAttendance(
		@Param("matchId") matchId: string,
		@Query("leftCompetitorAttendance") leftCompetitorAttendance: boolean,
		@Query("rightCompetitorAttendance") rightCompetitorAttendance: boolean,
	): Promise<ApiResponse<any>> {
		// console.log(leftCompetitorAttendance, ' ', rightCompetitorAttendance);
		// return;
		return await this.updateAttendanceUseCase.execute(
			matchId,
			leftCompetitorAttendance,
			rightCompetitorAttendance,
		);
	}

	@Put("update-start-time/:matchId")
	async updateStartTimeForMatch(
		@Param("matchId") matchId: string,
		@Query("currentServerId") currentServerId: string,
	): Promise<ApiResponse<Game>> {
		console.log(currentServerId);
		return await this.startMatchUseCase.execute(matchId, currentServerId);
	}

	@Put("update-point/:gameId")
	async updatePointOfGame(
		@Param("gameId") gameId: string,
		@Query("winningId") winningId: string,
	): Promise<ApiResponse<any>> {
		// console.log(gameId);
		return await this.updatePointUseCase.execute(gameId, winningId);
	}

	@Get("get-courts-available/:tournamentId")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async getCourtsAvailable(
		@Param("tournamentId") tournamentId: string,
	): Promise<ApiResponse<Court[]>> {
		return await this.getCourtsAvailableUseCase.execute(tournamentId);
	}

	@Get("assign-court-for-match")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async assignCourtForMatch(
		@Query("matchId") matchId: string,
		@Query("courtId") courtId: string,
	): Promise<ApiResponse<Match>> {
		return await this.assignCourtForMatchUseCase.execute(matchId, courtId);
	}

	@Get("assign-athlete-into-match/:matchId")
	// @UseGuards(JwtAccessTokenGuard, RolesGuard)
	// @Roles(RoleMap.Organizer.name)
	async assignAthleteIntoMatch(
		@Param("matchId") matchId: string,
		@Query("leftCompetitorId") leftCompetitorId: string,
		@Query("rightCompetitorId") rightCompetitorId: string,
	): Promise<ApiResponse<Match>> {
		console.log(matchId, " ", leftCompetitorId, " ", rightCompetitorId);
		return await this.assignAthleteIntoMatchUseCase.execute(
			matchId,
			leftCompetitorId,
			rightCompetitorId,
		);
	}

	@Get("get-athlete-matches")
	@UseGuards(JwtAccessTokenGuard)
	async getMatchesOfUser(
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<Match[]>> {
		return this.getMatchesOfUserUseCase.execute(user.id);
	}

	@Get("get-athlete-latest-matches/:userId")
	// @UseGuards(JwtAccessTokenGuard)
	async getAthleteLatestMatches(
		@Param("userId") userId: string,
	): Promise<ApiResponse<Match[]>> {
		return this.getLatestMatchesUseCase.execute(userId);
	}

	@Post("/create-event-log")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Umpire.name)
	async createEventLog(
		@Body() createEventLog: CreateLogEventDto,
	): Promise<ApiResponse<MatchLog>> {
		return await this.createEventlogUseCase.execute(createEventLog);
	}

	@Get("/get-all-log-message")
	async getAllLogMessage(): Promise<ApiResponse<MatchLogDetail[]>> {
		return await this.getAllLogMessageUseCase.execute();
	}

	@Get("/get-all-log-type")
	async getAllLogType(): Promise<ApiResponse<KeyValueType<string>[]>> {
		return await this.getAllLogTypeUseCase.execute();
	}

	@Put("/continue-match/:matchId")
	async continueMatch(
		@Param("matchId") matchId: string,
	): Promise<ApiResponse<Match>> {
		return await this.continueMatchUseCase.execute(matchId);
	}

	@Get("/get-all-match-log/:matchId")
	async getAllMatchLogs(
		@Param("matchId") matchId: string,
	): Promise<ApiResponse<MatchLog[]>> {
		return await this.getAllMatchLogUseCase.execute(matchId);
	}

	@Get("assign-players-to-matches/:tournamentEventId")
	async assignPlayersToMatches(
		@Param("tournamentEventId") tournamentEventId: string,
	): Promise<void> {
		return this.assignPlayerToMatchesUseCase.execute(tournamentEventId);
	}

	@Get("skip-matches/:tournamentEventId")
	async skipMatches(
		@Param("tournamentEventId") tournamentEventId: string,
	): Promise<void> {
		return this.skipMatchesUseCase.execute(tournamentEventId);
	}

	@Get("/count-matches-in-current-week")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async countMatchesInCurrentWeek(@Req() { user }: IRequestUser): Promise<
		ApiResponse<{
			currentCount: number;
			previousCount: number;
			changeRate: number;
		}>
	> {
		return await this.countMatchesInCurrentWeekUseCase.execute(user.id);
	}
}
