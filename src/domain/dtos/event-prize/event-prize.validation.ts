import { PrizeType } from "@prisma/client";

export class CreateEventPrizeRequest {
	prizeType: string;
	prizeName: string;
	prize: string;
	tournamentEventId: string;
}

export class UpdateEventPrizeRequest {
	id: string;
	prizeType: PrizeType;
	prizeName: string;
	prize: string;
	tournamentEventId: string;
}