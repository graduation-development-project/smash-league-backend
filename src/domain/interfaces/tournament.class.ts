import { Tournament } from "@prisma/client";
import { Type } from "class-transformer";
import { Allow, IS_ISO8601, IsArray, IsDateString, IsEnum, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateIf, ValidateNested } from "class-validator";


export enum FormatType {
	SINGLE_ELIMINATION = "SINGLE_ELIMINATION",
	ROUND_ROBIN = "ROUND_ROBIN"
}

export enum ParticipantType {
	Mens_Single = "MENS_SINGLE",
	Womens_Single = "WOMENS_SINGLE",
	Mens_Double = "MENS_DOUBLE",
	Womens_Double = "WOMENS_DOUBLE",
	Mixed_Double = "MIXED_DOUBLE"
}

export enum TournamentStatus {
	Opening = "OPENING",
	Opening_For_Registration = "OPENING_FOR_REGISTRATION",
	Drawing = "DRAWING",
	On_Going = "ON_GOING",
	Finished = "FINISHED"
}

export enum RequiredAttachment {
	Identification_Card = "IDENTIFICATION_CARD",
	Portrait_Photo = "PORTRAIT_PHOTO"
}

export class CreateTournamentSerie {
	@IsString()
	@IsNotEmpty()
	tournamentEvent: string;
}


export class CreateTournamentEvent {
	
	fromAge?: number;

	toAge?: number;

	@IsEnum(FormatType, {
		message: "Format type must be one of the following: " + 
		"SINGLE_ELIMINATION, " + "ROUND_ROBIN"
	})
	formatType: FormatType;

	winningPoint?: number;
	lastPoint: number;
	numberOfSets: number;
	@IsEnum(ParticipantType, {
		message: "Participant type must be one of the following: " + 
		"MENS_SINGLE, " + "WOMENS_SINGLE, " + "MENS_DOUBLE, " + "WOMENS_DOUBLE, " + "MIXED_DOUBLE" 
	})
	participantType: ParticipantType;
}

export class CreateTournament {
	@IsString()
	@IsNotEmpty()
	id: string; 

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@Allow()
	shortName?: string;

	@IsDateString()
	@IsISO8601()
	registrationOpeningDate: Date;

	@IsDateString()
	@IsISO8601()
	registrationClosingDate: Date;

	@IsDateString()
	@IsISO8601()
	drawDate: Date;

	@IsDateString()
	@IsISO8601()
	startDate: Date;

	@IsDateString()
	@IsISO8601()
	endDate: Date;

	@IsString()
	@IsNotEmpty()
	location: string;

	@IsNumber()
	@Min(0)
	@Max(100000000)
	registrationFeePerPerson: number;

	@IsNumber()
	@Min(0)
	@Max(100000000)
	registrationFeePerPair: number;

	@IsNumber()
	@Min(1)
	maxEventPerPerson: number;

	tournamentEventId?: string;

	@ValidateNested()
	@Type(() => CreateTournamentSerie)
	createTournamentSerie: CreateTournamentSerie;

	@ValidateNested({ each: true })
	@Type(() => CreateTournamentEvent)
	createTournamentEvent: CreateTournamentEvent[];

	@IsNumber()
	protestFeePerTime: number | 0;

	@IsDateString()
	@IsISO8601()
	checkinTimeBeforeStart: Date;

	@IsArray()
	@IsEnum(RequiredAttachment, {
		message: "Required attachment must be one of the following: " + 
		"IDENTIFICATION_CARD, " + "PORTRAIT_PHOTO",
		each: true
	})
	requiredAttachment: RequiredAttachment[];
}







// const ParticipantTypeMap = {
// 	MENS_SINGLE: "MENS_SINGLE",
// 	WOMENS_SINGLE: "WOMENS_SINGLE",
// 	MENS_DOUBLE: "MENS_DOUBLE",
// 	WOMENS_DOUBLE: "WOMENS_DOUBLE",
// 	MIXED_DOUBLE: "MIXED_DOUBLE"
// } as const;
// type ParticipantType = (typeof ParticipantTypeMap)[keyof typeof ParticipantTypeMap];