import { TournamentEvent } from "@prisma/client";

export interface TournamentEventRepositoryPort {
	getAllTournamentEvent(): Promise<TournamentEvent[]>;
	getAllTournamentEventOfUser(userId: string): Promise<TournamentEvent[]>;
	createNewTournamentEvent(): Promise<any>;
}