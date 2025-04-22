import { UpdateTournamentScheduleInformation } from './../../../domain/interfaces/tournament/tournament.validation';
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Tournament } from '@prisma/client';
import { ApiResponse } from "src/domain/dtos/api-response";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";

@Injectable()
export class UpdateTournamentScheduleInformationUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort
	) {
	}

	async execute(updateTournamentScheduleInformation: UpdateTournamentScheduleInformation): Promise<ApiResponse<any>> {
		const tournament = await this.tournamentRepository.getTournament(updateTournamentScheduleInformation.id);
		if (tournament === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Tournament not found!",
			null
		);
		return new ApiResponse<Tournament>(
			HttpStatus.NO_CONTENT,
			"Tournament schedule information updated successful!",
			await this.tournamentRepository.updateTournamentScheduleInformation(updateTournamentScheduleInformation)
		);
	}
}