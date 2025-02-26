import { Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { CreateTournament } from "src/domain/interfaces/tournament.class";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";

@Injectable()
export class CreateNewTournamentUseCase {
	constructor(
		@Inject("TournamentRepository") private readonly tournamentRepository: TournamentRepositoryPort
	) {}

	async execute(createTournament: CreateTournament) : Promise<ApiResponse<any>> {
		return null;
	}
}