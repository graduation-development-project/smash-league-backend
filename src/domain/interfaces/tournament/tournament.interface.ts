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
	tournamentSerie: string;
}


export class CreateTournamentEvent {
	@Min(6, {
		message: "Age for participating must be older than 6 years old."
	})
	@Max(90, {
		message: "Age for participating must be younger than 90 years old."
	})
	fromAge?: number;
	@Min(6, {
		message: "Age for participating must be older than 6 years old."
	})
	@Max(90, {
		message: "Age for participating must be younger than 90 years old."
	})
	toAge?: number;

	@IsEnum(FormatType, {
		message: "Format type must be one of the following: " + 
		"SINGLE_ELIMINATION, " + "ROUND_ROBIN"
	})
	formatType: FormatType;
	@Min(11, {
		message: "Winning point must be bigger than 11."
	})
	@Max(31, {
		message: "Winning point must be under 31."
	})
	winningPoint?: number;
	@Min(30, {
		message: "Last point must be bigger than 30."
	})
	@Max(51, {
		message: "Last point must be under 51."
	})
	lastPoint: number;
	@Min(1, {
		message: "Number of games must be bigger than 1."
	})
	@Max(5, {
		message: "Number of games must be under 5."
	})
	numberOfGames: number;
	
	minimumParticipantToStart: number;
	@IsEnum(ParticipantType, {
		message: "Participant type must be one of the following: " + 
		"MENS_SINGLE, " + "WOMENS_SINGLE, " + "MENS_DOUBLE, " + "WOMENS_DOUBLE, " + "MIXED_DOUBLE" 
	})
	participantType: ParticipantType;

	championshipPrize: string[];
	runnerUpPrize: string[];
	thirdPrize?: string[];
	jointThirdPrize?: string[];
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
	@IsString()
	mainColor: string;

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

export interface ICreateTournament {
	id: string;
	name: string;
	shortName: string | null;
	registrationOpeningDate: Date;
	registrationClosingDate: Date;
	drawDate: Date;
	startDate: Date;
	endDate: Date;
	checkInBeforeStart: Date;
	umpirePerMatch: number;
	registrationFeePerPerson: number;
	registrationFeePerPair: number | null;
	maxEventPerPerson: number;
	protestFeePerTime: number;
	prizePool: number;
	hasMerchandise: boolean;
	numberOfMerchandise: number;
	merchandiseImageContent: string[];
	merchandise: string;
}







// const ParticipantTypeMap = {
// 	MENS_SINGLE: "MENS_SINGLE",
// 	WOMENS_SINGLE: "WOMENS_SINGLE",
// 	MENS_DOUBLE: "MENS_DOUBLE",
// 	WOMENS_DOUBLE: "WOMENS_DOUBLE",
// 	MIXED_DOUBLE: "MIXED_DOUBLE"
// } as const;
// type ParticipantType = (typeof ParticipantTypeMap)[keyof typeof ParticipantTypeMap];