import { ResponseTournamentRegistrationDTO } from "../dtos/organizers/response-tournament-registration.dto";
import {TournamentRegistration} from "@prisma/client";

export interface OrganizersRepositoryPort {
	responseTournamentRegistration(
		responseTournamentRegistrationDTO: ResponseTournamentRegistrationDTO,
	): Promise<string>;

	getTournamentRegistrationByTournamentId(
		tournamentId: string,
		organizerId: string,
	): Promise<TournamentRegistration[]>;
}
