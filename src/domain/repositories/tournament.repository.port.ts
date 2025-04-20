import { Tournament, TournamentPost, TournamentUmpires } from "@prisma/client";
import {
	ICreateTournament,
	ITournamentContact,
	ITournamentDetailResponse,
	ITournamentInformation,
	ITournamentRegistrationInformation,
	ITournamentResponse,
	IUpdateTournament,
	IUpdateTournamentInformation,
	IUpdateTournamentRegistrationInformation,
} from "../interfaces/tournament/tournament.interface";
import { IPaginatedOutput, IPaginateOptions } from "../interfaces/interfaces";

export interface TournamentRepositoryPort {
	createTournament(tournament: ICreateTournament): Promise<Tournament>;

	getTournament(id: string): Promise<Tournament | null>;

	calculateTimeLeft(date: Date): string;

	calculateTimeDetailLeft(date: Date): string;

	searchTournament(
		options: IPaginateOptions,
		searchTerm?: string,
	): Promise<IPaginatedOutput<ITournamentResponse>>;

	getTournamentsByUserId(
		organizerId: string,
		options: IPaginateOptions,
	): Promise<IPaginatedOutput<ITournamentResponse>>;

	getTournamentsByUserId(
		organizerId: string,
		options: IPaginateOptions,
	): Promise<IPaginatedOutput<ITournamentResponse>>;

	getTournamentsByOrganizerId(
		organizerId: string,
		options: IPaginateOptions,
	): Promise<IPaginatedOutput<ITournamentResponse>>;

	filterTournament(): Promise<Tournament[]>;

	getTournamentDetail(tournamentId: string): Promise<ITournamentDetailResponse>;

	updateTournament(updateTournament: IUpdateTournament): Promise<Tournament>;

	getTournamentPost(tournamentId: string): Promise<TournamentPost[]>;

	getTournamentUmpire(tournamentId: string): Promise<TournamentUmpires[]>;

	getFeatureTournaments(): Promise<Tournament[]>;
	updateTournamentInformation(updateTournament: IUpdateTournamentInformation): Promise<Tournament>;
	updateTournamentContact(updateContact: any): Promise<Tournament>;
	getTournamentInformation(id: string): Promise<ITournamentInformation>;
	getTournamentContact(id: string): Promise<ITournamentContact>;
	updateTournamentRegistrationInformation(updateTournamentRegistration: IUpdateTournamentRegistrationInformation): Promise<Tournament>;
	getTournamentRegistration(id: string): Promise<ITournamentRegistrationInformation>;
	cancelTournament(tournamentId: string): Promise<Tournament>;
}
