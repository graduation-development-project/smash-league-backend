import { Tournament } from "@prisma/client";
import { ICreateTournament, ITournamentResponse } from "../interfaces/tournament/tournament.interface";
import { IPaginatedOutput, IPaginateOptions } from "../interfaces/interfaces";

export interface TournamentRepositoryPort {
	createTournament(tournament: ICreateTournament): Promise<Tournament>;

	getTournament(id: string): Promise<Tournament | null>;
	calculateTimeLeft(date: Date): string;

	searchTournament(
		options: IPaginateOptions,
		searchTerm?: string,
	): Promise<IPaginatedOutput<ITournamentResponse>>;

	filterTournament(): Promise<Tournament[]>;

	getTournamentDetail(tournamentId: string): Promise<Tournament>;
}
