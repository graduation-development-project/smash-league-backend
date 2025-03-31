import { Tournament, TournamentPost } from "@prisma/client";
import {
	ICreateTournament,
	ITournamentDetailResponse,
	ITournamentResponse,
	IUpdateTournament,
} from "../tournament/tournament.interface";
import { IPaginatedOutput, IPaginateOptions } from "../interfaces";

export interface TournamentRepositoryPort {
	createTournament(tournament: ICreateTournament): Promise<Tournament>;

	getTournament(id: string): Promise<Tournament | null>;

	calculateTimeLeft(date: Date): string;

	calculateTimeDetailLeft(date: Date): string;

	searchTournament(
		options: IPaginateOptions,
		searchTerm?: string,
	): Promise<IPaginatedOutput<ITournamentResponse>>;

	filterTournament(): Promise<Tournament[]>;

	getTournamentDetail(tournamentId: string): Promise<ITournamentDetailResponse>;

	updateTournament(updateTournament: IUpdateTournament): Promise<Tournament>;

	getTournamentPost(tournamentId: string): Promise<TournamentPost[]>;
}
