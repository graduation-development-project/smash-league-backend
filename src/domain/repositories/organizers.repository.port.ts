import { ResponseTournamentRegistrationDTO } from "../dtos/organizers/response-tournament-registration.dto";
import { Match, TournamentRegistration } from "@prisma/client";
import {
	ITournamentParticipantsResponse,
	ITournamentRegistrationResponse,
} from "../interfaces/tournament/tournament.interface";
import { AssignUmpireDTO } from "../dtos/organizers/assign-umpire.dto";

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

	assignUmpireForMatch(assignUmpireDTO: AssignUmpireDTO): Promise<Match>;
}
