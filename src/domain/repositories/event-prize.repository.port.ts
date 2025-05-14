import { EventPrize } from "@prisma/client";
import { ICreateEventPrize } from "../dtos/event-prize/event-prize.interface";

export interface EventPrizeRepositoryPort {
	getAllPrizeOfEvent(tournamentEventId: string): Promise<EventPrize[]>;
	getChampionshipPrizeOfTournamentEvent(tournamentEventId: string): Promise<EventPrize | null>;
	getRunnerUpPrizeOfTournamentEvent(tournamentEventId: string): Promise<EventPrize | null>;
	getThirdPlacePrizeOfTournamentEvent(tournamentEventId: string): Promise<EventPrize[] | null>;
	createEventPrizeOfTournamentEvent(createEventPrize: ICreateEventPrize): Promise<EventPrize>;
	updateEventPrizeOfTournamentEvent(): Promise<EventPrize[]>;
}