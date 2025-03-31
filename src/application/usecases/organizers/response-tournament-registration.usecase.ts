import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateNotificationDTO } from "../../../domain/dtos/notifications/create-notification.dto";
import { ResponseTournamentRegistrationDTO } from "../../../domain/dtos/organizers/response-tournament-registration.dto";
import { OrganizersRepositoryPort } from "../../../domain/interfaces/repositories/organizers.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";

@Injectable()
export class ResponseTournamentRegistrationUseCase {
	constructor(
		@Inject("OrganizerRepository")
		private organizerRepository: OrganizersRepositoryPort,
	) {}

	async execute(
		responseTournamentRegistrationDTO: ResponseTournamentRegistrationDTO,
	): Promise<ApiResponse<null>> {
		return new ApiResponse<null>(
			HttpStatus.NO_CONTENT,
			await this.organizerRepository.responseTournamentRegistration(
				responseTournamentRegistrationDTO,
			),
			null,
		);
	}
}
