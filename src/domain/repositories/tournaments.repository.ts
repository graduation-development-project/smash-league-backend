import { Tournament } from "@prisma/client";

export interface TournamentsRepositoryPort {

	searchTournaments(name: string): Promise<Tournament[]>;

}
