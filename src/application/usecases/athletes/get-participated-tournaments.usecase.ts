import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AthletesRepositoryPort } from "../../../domain/repositories/athletes.repository.port";
import { Tournament } from "@prisma/client";
import { ApiResponse } from "../../../domain/dtos/api-response";
import {
	IPaginatedOutput,
	IPaginateOptions,
} from "../../../domain/interfaces/interfaces";
import {IParticipatedTournamentResponse} from "../../../domain/interfaces/tournament/tournament.interface";

@Injectable()
export class GetParticipatedTournamentsUseCase {
	constructor(
		@Inject("AthleteRepository")
		private athletesRepository: AthletesRepositoryPort,
	) {}

	async execute(
		options: IPaginateOptions,
		userID: string,
		tournamentStatus: string,
	): Promise<ApiResponse<IPaginatedOutput<IParticipatedTournamentResponse>>> {
		return new ApiResponse(
			HttpStatus.OK,
			"Get participated tournament successfully.",
			await this.athletesRepository.getParticipatedTournaments(
				options,
				userID,
				tournamentStatus,
			),
		);
	}
}
