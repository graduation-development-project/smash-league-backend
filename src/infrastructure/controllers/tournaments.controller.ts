import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Query,
	Req,
	UseGuards,
} from "@nestjs/common";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import {
	IPaginatedOutput,
	IPaginateOptions,
	IRequestUser,
} from "../interfaces/interfaces";
import { EditUserDTO } from "../dto/users/edit-user.dto";
import { TUserWithRole } from "../types/users.type";
import { GetUserByIdUseCase } from "../../application/usecases/users/get-user-by-id.usecase";
import { SearchTournamentsUseCase } from "../../application/usecases/tournaments/search-tournaments.usecase";
import { Tournament } from "@prisma/client";
import { GetTournamentListUseCase } from "../../application/usecases/tournaments/get-tournament-list.usecase";

@Controller("/tournaments")
export class TournamentsController {
	constructor(
		private searchTournamentsUseCase: SearchTournamentsUseCase,
		private getTournamentListUseCase: GetTournamentListUseCase,
	) {}

	@Get("/")
	getTournamentsList(
		@Query() paginateOption: IPaginateOptions,
	): Promise<IPaginatedOutput<Tournament>> {
		return this.getTournamentListUseCase.execute(paginateOption);
	}

	@Get("/search")
	searchTournaments(
		@Query("searchTerm") searchTerm: string,
		@Query() paginateOption: IPaginateOptions,
	): Promise<IPaginatedOutput<Tournament>> {
		return this.searchTournamentsUseCase.execute(searchTerm, paginateOption);
	}
}
