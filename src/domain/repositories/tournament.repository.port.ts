import {
	Tournament,
	TournamentPost,
	TournamentStatus,
	TournamentUmpires,
} from "@prisma/client";
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
	IUpdateTournamentScheduleInformation,
} from "../interfaces/tournament/tournament.interface";
import { IPaginatedOutput, IPaginateOptions } from "../interfaces/interfaces";
import { UpdateTournamentMerchandiseDTO } from "../dtos/tournament/update-tournament-merchandise.dto";
import { UpdateTournamentRecruitmentDTO } from "../dtos/tournament/update-tournament-recruitment.dto";

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

	updateTournamentInformation(
		updateTournament: IUpdateTournamentInformation,
	): Promise<Tournament>;

	updateTournamentContact(updateContact: any): Promise<Tournament>;

	getTournamentInformation(id: string): Promise<ITournamentInformation>;

	getTournamentContact(id: string): Promise<ITournamentContact>;

	updateTournamentRegistrationInformation(
		updateTournamentRegistration: IUpdateTournamentRegistrationInformation,
	): Promise<Tournament>;

	getTournamentRegistration(
		id: string,
	): Promise<ITournamentRegistrationInformation>;

	cancelTournament(tournamentId: string): Promise<Tournament>;

	updateTournamentScheduleInformation(
		updateTournamentScheduleInformation: IUpdateTournamentScheduleInformation,
	): Promise<Tournament>;

	updateTournamentStatusToDrawing(tournamentId: string): Promise<Tournament>;

	getLatestFinishTournament(limit: number): Promise<Tournament[]>;

	updateTournamentStatus(
		tournamentId: string,
		status: TournamentStatus,
	): Promise<Tournament>;

	updateTournamentMerchandise(
		tournamentId: string,
		updateTournamentMerchandiseDTO: UpdateTournamentMerchandiseDTO,
	): Promise<Tournament>;

	updateTournamentRecruitment(
		tournamentId: string,
		updateTournamentRecruitmentDTO: UpdateTournamentRecruitmentDTO,
	): Promise<Tournament>;

	countTournamentStatusByOrganizerId(
		organizerId: string,
	): Promise<Record<string, number>>;

	countNumberOfTourInCurrentMonth(organizerId: string): Promise<{
		currentCount: number;
		previousCount: number;
		changeRate: number;
	}>;
}
