import { Inject, Injectable } from "@nestjs/common";
import { AthletesRepositoryPort } from "../../../domain/repositories/athletes.repository.port";
import { ResponseToTeamInvitationDTO } from "../../../domain/dtos/athletes/response-to-team-invitation.dto";

@Injectable()
export class ResponseToTeamInvitationUseCase {
	constructor(
		@Inject("AthleteRepository")
		private athletesRepository: AthletesRepositoryPort,
	) {}

	execute(
		responseToTeamInvitationDTO: ResponseToTeamInvitationDTO,
	): Promise<string> {
		return this.athletesRepository.responseToTeamInvitation(
			responseToTeamInvitationDTO,
		);
	}
}
