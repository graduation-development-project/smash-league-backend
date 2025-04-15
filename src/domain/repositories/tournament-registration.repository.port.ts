import {
	TournamentRegistration,
	TournamentRegistrationStatus,
} from "@prisma/client";
import { CreateTournamentRegistrationDTO } from "../dtos/tournament-registration/create-tournament-registration.dto";

export interface TournamentRegistrationRepositoryPort {
	getTournamentRegistrationById(
		tournamentRegistrationId: string,
	): Promise<TournamentRegistration>;

	updateStatus(
		tournamentRegistrationId: string,
		status: TournamentRegistrationStatus,
	): Promise<TournamentRegistration>;

	createTournamentRegistration(
		createTournamentRegistrationDTO: CreateTournamentRegistrationDTO,
	): Promise<TournamentRegistration>;}
