import { Sponsor, SponsorTier, TournamentSponsor } from "@prisma/client";
import { CreateTournamentSponsorDTO } from "../dtos/tournament-sponsor/create-tournament-sponsor.dto";

export interface TournamentSponsorRepositoryPort {
	createNewTournamentSponsor(
		createTournamentSponsorDTO: CreateTournamentSponsorDTO[]
	): Promise<TournamentSponsor[]>;

	findSponsorInTournament(tournamentId: string): Promise<Sponsor[]>
}
