import { TournamentEvent } from "@prisma/client";
import { ICreateTournamentEvent } from "../tournament/tournament.interface";
import { ITournamentEventParticipants } from "../tournament/tournament-event/tournament-event.interface";

export interface TournamentEventRepositoryPort {
	getAllTournamentEvent(tournamentId: string): Promise<TournamentEvent[]>;
	getAllTournamentEventOfUser(userId: string, tournamentId: string): Promise<TournamentEvent[]>;
	createNewTournamentEvent(): Promise<any>;
	createMultipleTournamentEvent(tournamentEvents: ICreateTournamentEvent[], tournamentId: string) : Promise<TournamentEvent[]>;
	getParticipantsOfTournamentEvent(tournamentEventId: string): Promise<ITournamentEventParticipants>;
	getTournamentEventOfTournament(tournamentId: string): Promise<TournamentEvent[]>;
}