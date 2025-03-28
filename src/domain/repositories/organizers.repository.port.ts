import { ResponseTournamentRegistrationDTO } from "../dtos/organizers/response-tournament-registration.dto";
import { Match, Tournament, TournamentRegistration } from "@prisma/client";
import {
	ITournamentDetailResponse,
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

	getOwnedTournament(organizerId: string): Promise<ITournamentDetailResponse[]>;
}
