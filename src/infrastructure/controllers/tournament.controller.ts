import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { BadmintonParticipantType, Tournament } from "@prisma/client";
import { CreateNewTournamentUseCase } from "src/application/usecases/tournament/create-new-tournament.useacase";
import { GetAllBadmintonParticipantTypeUseCase } from "src/application/usecases/tournament/get-all-badminton-participant-type.usecase";
import { GetAllFormatTypeUseCase } from "src/application/usecases/tournament/get-all-format-type.usecase";
import { GetAllTournamentUseCase } from "src/application/usecases/tournament/get-all-tournament.usecase";
import { ApiResponse } from "src/domain/dtos/api-response";
import { FormatType } from "src/domain/interfaces/tournament/tournament.interface";
import { CreateTournament } from "src/domain/interfaces/tournament/tournament.validation";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { IRequestUser } from "src/domain/interfaces/interfaces";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { RolesGuard } from "../guards/auth/role.guard";

@Controller("/tournaments")
export class TournamentController {
	constructor(
		private readonly getAllTournamentUseCase: GetAllTournamentUseCase,
		private readonly getAllBadmintonParticipantTypeUseCase: GetAllBadmintonParticipantTypeUseCase,
		private readonly getAllFormatTypeUseCase: GetAllFormatTypeUseCase,
		private readonly createNewTournamentUseCase: CreateNewTournamentUseCase
	) {	
	}

	@Get("/get-all")
	async getAllTournaments() : Promise<ApiResponse<Tournament[]>> {
		return await this.getAllTournamentUseCase.execute();
	}

	@Post("/create-tournament")
	@UseGuards(JwtAccessTokenGuard)
	@HttpCode(HttpStatus.OK)
	@HttpCode(HttpStatus.BAD_REQUEST)
	@HttpCode(HttpStatus.CREATED)
	async createNewTournament(@Req() request: IRequestUser, 
														@Body() createTournament: CreateTournament) : Promise<any> {
		return await this.createNewTournamentUseCase.execute(request, createTournament);
	}

	@Get("/get-all-badminton-participant-type")
	async getAllTournamentEvent() : Promise<ApiResponse<BadmintonParticipantType[]>> {
		return await this.getAllBadmintonParticipantTypeUseCase.execute();
	}

	@Get("/get-all-format-types")
	async getAllFormatTypes() : Promise<ApiResponse<FormatType[]>> {
		return await this.getAllFormatTypeUseCase.execute();
	}
}