import { RegisterTournamentDTO } from "../../infrastructure/dto/athletes/register-tournament.dto";
import { TournamentParticipant } from "@prisma/client";

export interface AthletesRepository {
	registerTournament(
		registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentParticipant>;
}
