import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { OrganizersRepositoryPort } from "../../../domain/interfaces/repositories/organizers.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { TournamentRegistration } from "@prisma/client";
import {
	ITournamentParticipantsResponse,
	ITournamentRegistrationResponse,
} from "../../../domain/interfaces/tournament/tournament.interface";

@Injectable()
export class GetTournamentParticipantsByTournamentIdUseCase {
	constructor(
		@Inject("OrganizerRepository")
		private organizerRepository: OrganizersRepositoryPort,
	) {}

	async execute(
		tournamentId: string,
		organizerId: string,
	): Promise<ApiResponse<ITournamentParticipantsResponse[]>> {
		return new ApiResponse<ITournamentParticipantsResponse[]>(
			HttpStatus.OK,
			"Get Tournament Participants List by TournamentId successfully!",
			await this.organizerRepository.getTournamentParticipantsByTournamentId(
				tournamentId,
				organizerId,
			),
		);
	}
}
