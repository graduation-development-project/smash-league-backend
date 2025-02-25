import { Body, Controller, Get, Post } from "@nestjs/common";
import { Tournament } from "@prisma/client";
import { GetAllTournamentUseCase } from "src/application/usecases/tournament/get-all-tournament.usecase";
import { ApiResponse } from "src/domain/dtos/api-response";
import { TournamentEntity } from "src/domain/entities/tournament/tournament.entity";
import { CreateTournament } from "src/domain/interfaces/tournament.class";

@Controller("/tournaments")
export class TournamentController {
	constructor(
		private readonly getAllTournamentUseCase: GetAllTournamentUseCase
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
}