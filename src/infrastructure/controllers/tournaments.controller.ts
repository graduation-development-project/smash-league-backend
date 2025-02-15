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

@Controller("/tournaments")
export class TournamentsController {
	constructor(private searchTournamentsUseCase: SearchTournamentsUseCase) {}

	@Get("/search")
	searchTournaments(
		@Query("searchTerm") searchTerm: string,
		@Query() paginateOption: IPaginateOptions,
	): Promise<IPaginatedOutput<Tournament>> {
		return this.searchTournamentsUseCase.execute(searchTerm, paginateOption);
	}
}
