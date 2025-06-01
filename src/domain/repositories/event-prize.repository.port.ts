import { EventPrize } from "@prisma/client";
import { ICreateEventPrize, IEventPrizeResponse } from "../dtos/event-prize/event-prize.interface";

export interface EventPrizeRepositoryPort {
	getAllPrizeOfEvent(tournamentEventId: string): Promise<EventPrize[]>;
	getPrize(prizeId: string): Promise<EventPrize>;
	getChampionshipPrizeOfTournamentEvent(tournamentEventId: string): Promise<EventPrize | null>;
	getRunnerUpPrizeOfTournamentEvent(tournamentEventId: string): Promise<EventPrize | null>;
	getThirdPlacePrizeOfTournamentEvent(tournamentEventId: string): Promise<EventPrize[] | null>;
	getOtherPrizesOfTournamentEvent(tournamentEventId: string): Promise<IEventPrizeResponse[] | null>;
	createEventPrizeOfTournamentEvent(createEventPrize: ICreateEventPrize): Promise<EventPrize>;
	updateEventPrizeOfTournamentEvent(): Promise<EventPrize[]>;
	updateWinnerForEventPrize(participantId: string, prizeId: string): Promise<EventPrize>;
}