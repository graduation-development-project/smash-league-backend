import {
	TournamentRegistration,
	TournamentRegistrationStatus,
} from "@prisma/client";

export interface TournamentRegistrationRepositoryPort {
	getTournamentRegistrationById(
		tournamentRegistrationId: string,
	): Promise<TournamentRegistration>;

	updateStatus(
		tournamentRegistrationId: string,
		status: TournamentRegistrationStatus,
	): Promise<TournamentRegistration>;
}
