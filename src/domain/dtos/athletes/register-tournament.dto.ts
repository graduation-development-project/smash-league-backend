import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EventTypesEnum } from "../../../infrastructure/enums/event-types.enum";

export class RegisterTournamentDTO {
	@IsNotEmpty()
	@IsString()
	userId: string;

	@IsNotEmpty()
	@IsString()
	tournamentId: string;

	@IsNotEmpty()
	tournamentDisciplineId: string;

	@IsOptional()
	@IsString()
	partnerId: string;
}
