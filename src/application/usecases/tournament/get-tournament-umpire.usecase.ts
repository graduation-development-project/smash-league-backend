import { Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { TournamentRepositoryPort } from "../../../domain/repositories/tournament.repository.port";
import { TournamentUmpires } from "@prisma/client";

@Injectable()
export class GetTournamentUmpireUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
	) {}

	async execute(
		tournamentId: string,
	): Promise<ApiResponse<TournamentUmpires[]>> {
		return new ApiResponse<TournamentUmpires[]>(
			200,
			"Get tournament umpires successfully!",
			await this.tournamentRepository.getTournamentUmpire(tournamentId),
		);
	}
}
