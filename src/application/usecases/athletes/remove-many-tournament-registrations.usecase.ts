import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { RegisterNewRoleDTO } from "../../../domain/dtos/athletes/register-new-role.dto";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { UserVerification } from "@prisma/client";
import { TournamentRegistrationRepositoryPort } from "../../../domain/repositories/tournament-registration.repository.port";

@Injectable()
export class RemoveManyTournamentRegistrationsUseCase {
	constructor(
		@Inject("TournamentRegistrationRepositoryPort")
		private tournamentRegistrationRepository: TournamentRegistrationRepositoryPort,
	) {}

	async execute(tournamentRegistrationIds: string[]): Promise<ApiResponse<void>> {
		return new ApiResponse<void>(
			HttpStatus.NO_CONTENT,
			"Remove tournament registrations list successfully",
			await this.tournamentRegistrationRepository.removeManyTournamentRegistration(
				tournamentRegistrationIds,
			),
		);
	}
}
