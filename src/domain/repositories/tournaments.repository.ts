import { Tournament } from "@prisma/client";

export interface TournamentsRepositoryPort {
	searchTournaments(searchTerm: string): Promise<Tournament[]>;
}
