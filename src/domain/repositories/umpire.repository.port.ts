import { Match, Tournament, UserVerification } from "@prisma/client";
import { UmpireUpdateMatchDTO } from "../dtos/umpire/umpire-update-match.dto";

export interface UmpireRepositoryPort {
	umpireUpdateMatch(updateMatchDTO: UmpireUpdateMatchDTO): Promise<string>;

	getAssignedMatches(umpireId: string, tournamentId: string): Promise<Match[]>;

	getParticipateTournaments(umpireId: string): Promise<Tournament[]>
}
