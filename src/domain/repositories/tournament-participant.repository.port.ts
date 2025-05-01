import {
	TournamentParticipants,
	TournamentRegistration,
	TournamentRegistrationStatus,
} from "@prisma/client";

export interface TournamentParticipantsRepositoryPort {
	addTournamentParticipant(
		tournamentId: string,
		tournamentEventId: string,
		playerId: string,
		partnerId?: string,
	): Promise<TournamentParticipants>;

	getParticipantInTournament(tournamentId: string, userId: string): Promise<TournamentParticipants[]>;

	getEventParticipantList(tournamentId: string, tournamentEventId: string): Promise<TournamentParticipants[]>;
}
