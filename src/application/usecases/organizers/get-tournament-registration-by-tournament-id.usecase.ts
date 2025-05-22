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
	): Promise<ApiResponse<TournamentRegistration[]>> {
		const tournamentRegistrations = await this.organizerRepository.getTournamentRegistrationByTournamentId(
			tournamentId,
			organizerId
		);
		console.log(tournamentRegistrations[0].submittedAnswersForEvent);
		tournamentRegistrations.map((item) => ({
			...item,
			submittedAnswersForEvent: item.submittedAnswersForEvent[0]
		}));
		return new ApiResponse<TournamentRegistration[]>(
			HttpStatus.OK,
			"Get Tournament Registration List by TournamentId successfully!",
			tournamentRegistrations
		);
	}
}
