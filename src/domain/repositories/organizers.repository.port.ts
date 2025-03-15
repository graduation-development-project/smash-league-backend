import { ResponseTournamentRegistrationDTO } from "../dtos/organizers/response-tournament-registration.dto";

export interface OrganizersRepositoryPort {
	responseTournamentRegistration(
		responseTournamentRegistrationDTO: ResponseTournamentRegistrationDTO,
	): Promise<string>;
}
