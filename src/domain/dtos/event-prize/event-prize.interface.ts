import { PrizeType } from "@prisma/client";

export interface ICreateEventPrize {
	prizeType: string;
	prizeName: string;
	prize: string;
	tournamentEventId: string;
}

export interface IEventPrizeResponse {
	prizeType: PrizeType;
	prizeName: string;
	prize: string;
}