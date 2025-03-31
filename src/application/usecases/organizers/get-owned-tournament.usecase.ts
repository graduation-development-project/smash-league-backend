import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { OrganizersRepositoryPort } from "../../../domain/repositories/organizers.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { Tournament } from "@prisma/client";
import { ITournamentDetailResponse } from "../../../domain/interfaces/tournament/tournament.interface";

@Injectable()
export class GetOwnedTournamentUseCase {
	constructor(
		@Inject("OrganizerRepository")
		private organizerRepository: OrganizersRepositoryPort,
	) {}

	async execute(organizerId: string): Promise<ApiResponse<ITournamentDetailResponse[]>> {
		return new ApiResponse<ITournamentDetailResponse[]>(
			HttpStatus.OK,
			"Get owned tournaments successfully!",
			await this.organizerRepository.getOwnedTournament(organizerId),
		);
	}
}
