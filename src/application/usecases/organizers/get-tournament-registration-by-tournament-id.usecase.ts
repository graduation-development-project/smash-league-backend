import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { OrganizersRepositoryPort } from "../../../domain/repositories/organizers.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { TournamentRegistration } from "@prisma/client";
import {ITournamentRegistrationResponse} from "../../../domain/interfaces/tournament/tournament.interface";

@Injectable()
export class GetTournamentRegistrationByTournamentIdUseCase {
	constructor(
		@Inject("OrganizerRepository")
		private organizerRepository: OrganizersRepositoryPort,
	) {}

	async execute(
		tournamentId: string,
		organizerId: string,
	): Promise<ApiResponse<ITournamentRegistrationResponse[]>> {
		return new ApiResponse<ITournamentRegistrationResponse[]>(
			HttpStatus.OK,
			"Get Tournament Registration List by TournamentId successfully!",
			await this.organizerRepository.getTournamentRegistrationByTournamentId(
				tournamentId,
				organizerId,
			),
		);
	}
}
