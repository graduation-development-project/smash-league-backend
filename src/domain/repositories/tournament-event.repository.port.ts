import { Tournament, TournamentEvent } from "@prisma/client";
import { ICreateTournamentEvent } from "../interfaces/tournament/tournament.interface";
import { IParticipantsOfTournamentEvent, ITournamentEventParticipants } from "../interfaces/tournament/tournament-event/tournament-event.interface";
import {
	ITournamentStandingBoardInterface
} from "../interfaces/tournament/tournament-event/tournament-standing-board.interface";

export interface TournamentEventRepositoryPort {
	getAllTournamentEvent(tournamentId: string): Promise<TournamentEvent[]>;
	getAllTournamentEventOfUser(userId: string, tournamentId: string): Promise<TournamentEvent[]>;
	createNewTournamentEvent(): Promise<any>;
	createMultipleTournamentEvent(tournamentEvents: ICreateTournamentEvent[], tournamentId: string) : Promise<TournamentEvent[]>;
	getParticipantsOfTournamentEvent(tournamentEventId: string): Promise<ITournamentEventParticipants>;
	getParticipantsByTournamentEvent(tournamentEventId: string): Promise<IParticipantsOfTournamentEvent>;

	getTournamentEventOfTournament(tournamentId: string): Promise<TournamentEvent[]>;
	getTournamentEventStandingBoard(tournamentEventId: string): Promise<ITournamentStandingBoardInterface>
	getTournamentEventById(tournamentEventId: string): Promise<TournamentEvent>;
	getTournamentOfTournamentEvent(tournamentEventId: string): Promise<Tournament>;
	updateManyTournamentEvent(tournamentEvents: TournamentEvent[]): Promise<TournamentEvent[]>;
}