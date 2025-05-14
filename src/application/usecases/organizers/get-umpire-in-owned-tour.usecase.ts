import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TournamentUmpireRepositoryPort } from "../../../domain/repositories/tournament-umpire.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { TournamentUmpires } from "@prisma/client";

@Injectable()
export class GetUmpireInOwnedTourUseCase {
	constructor(
		@Inject("TournamentUmpireRepositoryPort")
		private tournamentUmpireRepository: TournamentUmpireRepositoryPort,
	) {}

	async execute(
		organizerId: string,
	): Promise<ApiResponse<TournamentUmpires[]>> {
		return new ApiResponse<TournamentUmpires[]>(
			HttpStatus.OK,
			"Get owned umpires successfully",
			await this.tournamentUmpireRepository.getUmpireListByOrganizerId(
				organizerId,
			),
		);
	}
}
