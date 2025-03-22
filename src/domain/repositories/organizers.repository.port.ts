import { ResponseTournamentRegistrationDTO } from "../dtos/organizers/response-tournament-registration.dto";
import { TournamentRegistration } from "@prisma/client";
import {
	ITournamentParticipantsResponse,
	ITournamentRegistrationResponse
} from "../interfaces/tournament/tournament.interface";

export interface OrganizersRepositoryPort {
	responseTournamentRegistration(
		responseTournamentRegistrationDTO: ResponseTournamentRegistrationDTO,
	): Promise<string>;

	getTournamentRegistrationByTournamentId(
		tournamentId: string,
		organizerId: string,
	): Promise<ITournamentRegistrationResponse[]>;

	getTournamentParticipantsByTournamentId(
		tournamentId: string,
		organizerId: string,
	): Promise<ITournamentParticipantsResponse[]>;
}
