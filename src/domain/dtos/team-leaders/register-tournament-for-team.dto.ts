import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";
import { EventTypesEnum } from "../../../infrastructure/enums/event-types.enum";
import { User } from "@prisma/client";

export class RegisterTournamentForTeamDTO {
	@IsNotEmpty()
	playerId: string;

	@IsNotEmpty()
	@IsString()
	tournamentId: string;

	@IsOptional()
	@IsString()
	partnerId: string;

	@IsOptional()
	@IsString()
	tournamentEventId: string;

	@IsOptional()
	fromTeamId: string;

	@IsOptional()
	registrationDocumentCreator: string[]

	@IsOptional()
	registrationDocumentPartner: string[]
}
