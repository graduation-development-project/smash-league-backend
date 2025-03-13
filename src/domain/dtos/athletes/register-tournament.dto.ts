import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";
import { EventTypesEnum } from "../../../infrastructure/enums/event-types.enum";

export class RegisterTournamentDTO {
	@IsOptional()
	userId: string;

	@IsNotEmpty()
	@IsString()
	tournamentId: string;

	@IsOptional()
	@IsString()
	partnerEmail: string;

	@IsOptional()
	@IsString()
	tournamentEventId: string;

	// @IsNotEmpty()
	// @IsArray()
	// registrationDocumentCreator: string[];
	//
	// @IsOptional()
	// registrationDocumentPartner: string[];

	@IsNotEmpty()
	@IsString()
	registrationRole: string;

	@IsOptional()
	fromTeamId: string;

	@IsOptional()
	files: Express.Multer.File[];
}
