import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Tournament } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ITournamentDetailResponse } from "src/domain/interfaces/tournament/tournament.interface";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";

@Injectable()
export class GetTournamentDetailUseCase {
	constructor(
		@Inject("TournamentRepository") 
		private readonly tournamentRepository: TournamentRepositoryPort
	) {
		
	}
	
	async execute(id: string) : Promise<ApiResponse<ITournamentDetailResponse>> {
		const tournament = await this.tournamentRepository.getTournamentDetail(id);
		if (tournament === null) return new ApiResponse<null | undefined>(
			HttpStatus.OK,
			"Tournament not found!",
			null
		);
		return new ApiResponse<ITournamentDetailResponse>(
			HttpStatus.OK,
			"Get tournament detail successful!",
			tournament
		);
	}
}