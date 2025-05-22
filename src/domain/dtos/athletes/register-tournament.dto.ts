import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";
import { EventTypesEnum } from "../../../infrastructure/enums/event-types.enum";
import {User} from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export class RegisterTournamentDTO {
	@IsOptional()
	user: User;

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
	@IsOptional()
	submittedAnswerForTournament: any;
	@IsOptional()
	submittedAnswerForEvent: any;
}
