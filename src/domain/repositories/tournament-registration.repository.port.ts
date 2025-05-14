import {
	TournamentRegistration,
	TournamentRegistrationStatus,
} from "@prisma/client";
import { CreateTournamentRegistrationDTO } from "../dtos/tournament-registration/create-tournament-registration.dto";
import { GetRegistrationStatsInput } from "../interfaces/interfaces";

export interface TournamentRegistrationRepositoryPort {
	getTournamentRegistrationById(
		tournamentRegistrationId: string,
	): Promise<TournamentRegistration>;

	getTournamentRegistrationListByEvent(
		tournamentId: string,
		tournamentEventId: string,
	): Promise<TournamentRegistration[]>;

	updateStatus(
		tournamentRegistrationId: string,
		status: TournamentRegistrationStatus,
	): Promise<TournamentRegistration>;

	createTournamentRegistration(
		createTournamentRegistrationDTO: CreateTournamentRegistrationDTO,
	): Promise<TournamentRegistration>;

	removeTournamentRegistration(tournamentRegistrationId: string): Promise<void>;

	removeManyTournamentRegistration(
		tournamentRegistrationIds: string[],
	): Promise<void>;

	cancelManyTournamentRegistration(
		tournamentRegistrationIds: string[],
	): Promise<void>;

	getRegistrationCountByPeriod({
		organizerId,
		period,
		fromDate,
		toDate,
	}: GetRegistrationStatsInput): Promise<Record<string, number>>;

	getRevenueByPeriod({
		organizerId,
		period,
		fromDate,
		toDate,
	}: GetRegistrationStatsInput): Promise<Record<string, number>>;
}
