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

	getTournamentRegistrationByTournamentEventId(
		tournamentEventId: string,
		organizerId: string,
	): Promise<TournamentRegistration[]>;

	getUmpireRegistrationByTournamentId(
		tournamentId: string,
		organizerId: string,
	): Promise<TournamentRegistration[]>;

	getTournamentParticipantsByTournamentId(
		tournamentEventId: string,
		organizerId: string,
	): Promise<ITournamentParticipantsResponse[]>;

	assignUmpireForMatch(assignUmpireDTO: AssignUmpireDTO): Promise<Match>;

	getOwnedTournament(organizerId: string): Promise<ITournamentDetailResponse[]>;
}
