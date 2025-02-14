import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EventTypesEnum } from "../../enums/event-types.enum";

export class RegisterTournamentDTO {
	@IsNotEmpty()
	@IsString()
	userId: string;

	@IsNotEmpty()
	@IsString()
	tournamentId: string;

	@IsNotEmpty()
	@IsEnum(EventTypesEnum)
	eventType: string;

	@IsOptional()
	@IsString()
	partnerId: string;
}
