import {
	TournamentRegistration,
	TournamentRegistrationStatus,
} from "@prisma/client";
import { CreateTournamentRegistrationDTO } from "../dtos/tournament-registration/create-tournament-registration.dto";

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
}
