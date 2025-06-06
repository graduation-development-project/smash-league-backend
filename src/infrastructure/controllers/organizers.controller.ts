import {
	Body,
	Controller,
	Get,
	Param,
	Put,
	Query,
	Req,
	UseGuards,
} from "@nestjs/common";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { IRequestUser } from "../../domain/interfaces/interfaces";
import {
	Match,
	Notification,
	Tournament,
	TournamentRegistration,
} from "@prisma/client";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { ResponseTournamentRegistrationUseCase } from "../../application/usecases/organizers/response-tournament-registration.usecase";
import { ApiResponse } from "../../domain/dtos/api-response";
import { ResponseTournamentRegistrationDTO } from "../../domain/dtos/organizers/response-tournament-registration.dto";
import { GetTournamentRegistrationByTournamentIdUseCase } from "../../application/usecases/organizers/get-tournament-registration-by-tournament-id.usecase";
import {
	ITournamentDetailResponse,
	ITournamentParticipantsResponse,
	ITournamentRegistrationResponse,
} from "../../domain/interfaces/tournament/tournament.interface";
import { GetTournamentParticipantsByTournamentIdUseCase } from "../../application/usecases/organizers/get-tournament-participants-by-tournament-id.usecase";
import { AssignUmpireUseCase } from "../../application/usecases/organizers/assign-umpire.usecase";
import { AssignUmpireDTO } from "../../domain/dtos/organizers/assign-umpire.dto";
import { GetOwnedTournamentUseCase } from "../../application/usecases/organizers/get-owned-tournament.usecase";
import { GetUmpireRegistrationUseCase } from "../../application/usecases/organizers/get-umpire-registration.usecase";
import { GetRegistrationCountByPeriodUseCase } from "../../application/usecases/organizers/get-registration-by-period.usecase";
import { GetRevenueByPeriodUseCase } from "../../application/usecases/organizers/get-revenue-by-period.usecase";
import { GetUmpireInOwnedTourUseCase } from "../../application/usecases/organizers/get-umpire-in-owned-tour.usecase";
import { CountTournamentStatusUseCase } from "../../application/usecases/organizers/count-tournament-status.usecase";
import { CountMatchesStatusUseCase } from "../../application/usecases/organizers/count-matches-status.usecase";
import { GetRevenueInCurrentMonthUseCase } from "../../application/usecases/organizers/get-revenue-in-current-month.usecase";
import { CountRegistrationInCurrentMonthUseCase } from "../../application/usecases/organizers/count-registration-in-current-month.usecase";
import { BanUserUseCase } from "../../application/usecases/organizers/ban-user.usecase";

@Controller("/organizers")
@UseGuards(JwtAccessTokenGuard, RolesGuard)
@Roles(RoleMap.Organizer.name)
export class OrganizerController {
	constructor(
		private responseTournamentRegistrationUseCase: ResponseTournamentRegistrationUseCase,
		private getTournamentRegistrationByTournamentIdUseCase: GetTournamentRegistrationByTournamentIdUseCase,
		private getTournamentParticipantsByTournamentIdUseCase: GetTournamentParticipantsByTournamentIdUseCase,
		private assignUmpireUseCase: AssignUmpireUseCase,
		private getOwnedTournamentUseCase: GetOwnedTournamentUseCase,
		private getUmpireRegistrationUseCase: GetUmpireRegistrationUseCase,
		private getRegistrationCountByPeriodUseCase: GetRegistrationCountByPeriodUseCase,
		private getRevenueByPeriodUseCase: GetRevenueByPeriodUseCase,
		private getUmpireInOwnedTourUseCase: GetUmpireInOwnedTourUseCase,
		private countTournamentStatusUseCase: CountTournamentStatusUseCase,
		private countMatchesStatusUseCase: CountMatchesStatusUseCase,
		private getRevenueInCurrentMonthUseCase: GetRevenueInCurrentMonthUseCase,
		private countRegistrationInCurrentMonthUseCase: CountRegistrationInCurrentMonthUseCase,
		private banUserUseCase: BanUserUseCase,
	) {}

	@Get("/tournament-registration/:tournamentEventId")
	getTournamentRegistrationByTournamentEventId(
		@Param("tournamentEventId") tournamentEventId: string,
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<TournamentRegistration[]>> {
		return this.getTournamentRegistrationByTournamentIdUseCase.execute(
			tournamentEventId,
			user.id,
		);
	}

	@Get("/umpire-registration/:tournamentId")
	getUmpireRegustrationByTournamentId(
		@Param("tournamentId") tournamentId: string,
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<TournamentRegistration[]>> {
		return this.getUmpireRegistrationUseCase.execute(tournamentId, user.id);
	}

	@Get("/tournament-participants/:tournamentId")
	getTournamentParticipantsTournamentId(
		@Param("tournamentId") tournamentId: string,
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<ITournamentParticipantsResponse[]>> {
		return this.getTournamentParticipantsByTournamentIdUseCase.execute(
			tournamentId,
			user.id,
		);
	}

	@Get("/owned-tournaments")
	getOwnedTournament(
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<ITournamentDetailResponse[]>> {
		return this.getOwnedTournamentUseCase.execute(user.id);
	}

	@Put("/response-tournament-registration")
	responseTournamentRegistration(
		@Body()
		responseTournamentRegistrationDTO: ResponseTournamentRegistrationDTO,
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<null>> {
		return this.responseTournamentRegistrationUseCase.execute({
			...responseTournamentRegistrationDTO,
			userId: user.id,
		});
	}

	@Put("/assign-umpire")
	assignUmpire(
		@Body() assignUmpireDTO: AssignUmpireDTO,
	): Promise<ApiResponse<Match>> {
		return this.assignUmpireUseCase.execute(assignUmpireDTO);
	}

	@Get("registration-counts")
	async getRegistrationCounts(
		@Req() { user }: IRequestUser,
		@Query("period") period: "daily" | "weekly" | "monthly" | "yearly",
		@Query("fromDate") fromDate?: string,
		@Query("toDate") toDate?: string,
	) {
		const parsedFromDate = fromDate ? new Date(fromDate) : undefined;
		const parsedToDate = toDate ? new Date(toDate) : undefined;

		return this.getRegistrationCountByPeriodUseCase.execute({
			organizerId: user.id,
			period,
			fromDate: parsedFromDate,
			toDate: parsedToDate,
		});
	}

	@Get("revenue-counts")
	async getRevenueCounts(
		@Req() { user }: IRequestUser,
		@Query("period") period: "daily" | "weekly" | "monthly" | "yearly",
		@Query("fromDate") fromDate?: string,
		@Query("toDate") toDate?: string,
	) {
		const parsedFromDate = fromDate ? new Date(fromDate) : undefined;
		const parsedToDate = toDate ? new Date(toDate) : undefined;

		return this.getRevenueByPeriodUseCase.execute({
			organizerId: user.id,
			period,
			fromDate: parsedFromDate,
			toDate: parsedToDate,
		});
	}

	@Get("umpire-in-owned-tournaments")
	async getUmpireInOwnedTournaments(@Req() { user }: IRequestUser) {
		return this.getUmpireInOwnedTourUseCase.execute(user.id);
	}

	@Get("count-tournaments-status")
	async countTournamentsStatus(@Req() { user }: IRequestUser) {
		return this.countTournamentStatusUseCase.execute(user.id);
	}

	@Get("count-matches-status")
	async countMatchesStatus(@Req() { user }: IRequestUser) {
		return this.countMatchesStatusUseCase.execute(user.id);
	}

	@Get("current-month-revenue")
	async currentMonthRevenue(@Req() { user }: IRequestUser) {
		return this.getRevenueInCurrentMonthUseCase.execute(user.id);
	}

	@Get("/count-registrations-in-current-month")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async countRegistrationsInCurrentMonth(
		@Req() { user }: IRequestUser,
	): Promise<
		ApiResponse<{
			currentCount: number;
			previousCount: number;
			changeRate: number;
		}>
	> {
		return await this.countRegistrationInCurrentMonthUseCase.execute(user.id);
	}

	@Put("/ban-user")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async banUser(
		@Body()
		banUserDTO: {
			tournamentId: string;
			participantId: string;
			reason: string;
		},
	): Promise<ApiResponse<void>> {
		return await this.banUserUseCase.execute(
			banUserDTO.participantId,
			banUserDTO.tournamentId,
			banUserDTO.reason,
		);
	}
}
