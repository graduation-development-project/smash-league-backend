import { TournamentRegistrationRole } from "@prisma/client";

export class CreateTournamentRegistrationDTO {
	tournamentId: string;
	userId: string;
	tournamentEventId?: string
	partnerId?: string
	registrationDocumentCreator?: string[]
	registrationDocumentPartner?: string[]
	registrationRole: TournamentRegistrationRole
	fromTeamId?: string
}