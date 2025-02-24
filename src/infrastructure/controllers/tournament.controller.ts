import { Controller, Get } from "@nestjs/common";
import { Tournament } from "@prisma/client";
import { GetAllTournamentUseCase } from "src/application/usecases/tournament/get-all-tournament.usecase";
import { ApiResponse } from "src/domain/dtos/api-response";
import { TournamentEntity } from "src/domain/entities/tournament/tournament.entity";

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
}