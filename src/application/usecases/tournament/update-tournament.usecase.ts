import { ApiResponse } from 'src/domain/dtos/api-response';
import { UpdateTournament } from './../../../domain/interfaces/tournament/tournament.validation';
import { HttpStatus, Inject } from "@nestjs/common";
import { ITournamentDetailResponse } from 'src/domain/interfaces/tournament/tournament.interface';
import { TournamentSerieRepositoryPort } from "src/domain/repositories/tournament-serie.repository.port";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";
import { Tournament } from '@prisma/client';

export class UpdateTournamentUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
		@Inject("TournamentSerieRepository")
		private readonly tournamentSerieRepository: TournamentSerieRepositoryPort
	) {
	}

	async execute(updateTournament: UpdateTournament): Promise<ApiResponse<Tournament | null>> {
		const tournament = await this.tournamentRepository.getTournament(updateTournament.id);
		if (tournament === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Not found tournament to update",
			null
		);
		const tournamentUpdate = await this.tournamentRepository.updateTournament({
			...updateTournament
		});
		return new ApiResponse<Tournament | null>(
			HttpStatus.NO_CONTENT,
			"Update tournament successful!",
			null
		);
	}
}