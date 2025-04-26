import { Sponsor, SponsorTier, TournamentSponsor } from "@prisma/client";
import { CreateTournamentSponsorDTO } from "../dtos/tournament-sponsor/create-tournament-sponsor.dto";

export interface TournamentSponsorRepositoryPort {
	createNewTournamentSponsor(
		createTournamentSponsorDTO: CreateTournamentSponsorDTO[],
	): Promise<TournamentSponsor[]>;

	findSponsorInTournament(tournamentId: string): Promise<Sponsor[]>;

	findTournamentSponsor(
		tournamentId: string,
		sponsorId: string,
	): Promise<TournamentSponsor>;

	editTournamentSponsorTier(
		tournamentId: string,
		sponsorId: string,
		tier: SponsorTier,
	): Promise<TournamentSponsor>;

	removeTournamentSponsor(
		tournamentId: string,
		sponsorId: string,
	): Promise<void>;
}
