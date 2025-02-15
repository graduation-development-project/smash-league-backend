import { RegisterTournamentDTO } from "../../infrastructure/dto/athletes/register-tournament.dto";
import { Tournament, TournamentParticipant } from "@prisma/client";

export interface AthletesRepository {
	registerTournament(
		registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentParticipant>;

	getParticipatedTournaments(
		userID: string,
		tournamentStatus: string,
	): Promise<Tournament[]>;
}
