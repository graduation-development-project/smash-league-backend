import { TournamentUmpires } from "@prisma/client";

export interface TournamentUmpireRepositoryPort {
	createTournamentUmpire(
		tournamentId: string,
		userId: string,
	): Promise<TournamentUmpires>;

	getTournamentUmpiresList(tournamentId: string): Promise<TournamentUmpires[]>;
}
