import { Body, Controller, Get, Post } from "@nestjs/common";
import { BadmintonParticipantType, Tournament } from "@prisma/client";
import { GetAllBadmintonParticipantTypeUseCase } from "src/application/usecases/tournament/get-all-badminton-participant-type.usecase";
import { GetAllFormatTypeUseCase } from "src/application/usecases/tournament/get-all-format-type.usecase";
import { GetAllTournamentUseCase } from "src/application/usecases/tournament/get-all-tournament.usecase";
import { ApiResponse } from "src/domain/dtos/api-response";
import { CreateTournament, FormatType, ParticipantType } from "src/domain/interfaces/tournament.class";

@Controller("/tournaments")
export class TournamentController {
	constructor(
		private readonly getAllTournamentUseCase: GetAllTournamentUseCase,
		private readonly getAllBadmintonParticipantTypeUseCase: GetAllBadmintonParticipantTypeUseCase,
		private readonly getAllFormatTypeUseCase: GetAllFormatTypeUseCase
	) {	
	}

	@Get("/get-all")
	async getAllTournaments() : Promise<ApiResponse<Tournament[]>> {
		return await this.getAllTournamentUseCase.execute();
	}

	@Post("/create-tournament")
	async createNewTournament(@Body() createTournament: CreateTournament) : Promise<any> {
		return createTournament;
	}

	@Get("/get-all-badminton-participant-type")
	async getAllTournamentEvent() : Promise<ApiResponse<ParticipantType[]>> {
		return await this.getAllBadmintonParticipantTypeUseCase.execute();
	}

	@Get("/get-all-format-types")
	async getAllFormatTypes() : Promise<ApiResponse<FormatType[]>> {
		return await this.getAllFormatTypeUseCase.execute();
	}
}