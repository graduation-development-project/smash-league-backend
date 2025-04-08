import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Tournament } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";
import {
	IPaginatedOutput,
	IPaginateOptions,
} from "../../../domain/interfaces/interfaces";
import { ITournamentResponse } from "src/domain/interfaces/tournament/tournament.interface";

@Injectable()
export class GetTournamentsByOrganizerIdUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
	) {}

	async execute(
		organizerId: string,
		options: IPaginateOptions,
	): Promise<ApiResponse<IPaginatedOutput<ITournamentResponse>>> {
		return new ApiResponse<IPaginatedOutput<ITournamentResponse>>(
			HttpStatus.OK,
			"Get all tournaments by organizer id successful!",
			await this.tournamentRepository.getTournamentsByOrganizerId(
				organizerId,
				options,
			),
		);
	}
}
