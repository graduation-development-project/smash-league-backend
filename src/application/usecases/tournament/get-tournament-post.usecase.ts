import { Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { TournamentPost } from "@prisma/client";
import { TournamentRepositoryPort } from "../../../domain/repositories/tournament.repository.port";

@Injectable()
export class GetTournamentPostUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
	) {}

	async execute(tournamentId: string): Promise<ApiResponse<TournamentPost[]>> {
		return new ApiResponse<TournamentPost[]>(
			200,
			"Get tournament posts successfully!",
			await this.tournamentRepository.getTournamentPost(tournamentId),
		);
	}
}
