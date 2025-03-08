import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";
import { EventTypesEnum } from "../../../infrastructure/enums/event-types.enum";

export class RegisterTournamentDTO {
	@IsOptional()
	userId?: string;

	@IsNotEmpty()
	@IsString()
	tournamentId: string;

	@IsNotEmpty()
	@IsString()
	tournamentEventId: string;

	@IsOptional()
	@IsEmail()
	partnerEmail?: string;
}
