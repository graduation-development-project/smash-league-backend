import {
	Allow,
	IsArray,
	IsBoolean,
	IsDateString,
	IsEmail,
	IsEnum,
	IsISO8601,
	IsNotEmpty,
	IsNumber,
	IsPhoneNumber,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
	ValidateNested,
} from "class-validator";
import { FormatType, RequiredAttachment } from "./tournament.interface";
import { Type } from "class-transformer";
import { BadmintonParticipantType } from "@prisma/client";

export class CreateTournamentSerie {
	@IsString()
	@IsNotEmpty()
	tournamentSerieName: string;
}

export class CreateTournamentEvent {
	@Min(6, {
		message: "Age for participating must be older than 6 years old.",
	})
	@Max(90, {
		message: "Age for participating must be younger than 90 years old.",
	})
	fromAge?: number;
	@Min(6, {
		message: "Age for participating must be older than 6 years old.",
	})
	@Max(90, {
		message: "Age for participating must be younger than 90 years old.",
	})
	toAge?: number;

	@IsEnum(FormatType, {
		message:
			"Format type must be one of the following: " +
			"SINGLE_ELIMINATION, " +
			"ROUND_ROBIN",
	})
	typeOfFormat: FormatType;
	@Min(11, {
		message: "Winning point must be bigger than 11.",
	})
	@Max(31, {
		message: "Winning point must be under 31.",
	})
	winningPoint?: number;
	@Min(30, {
		message: "Last point must be bigger than 30.",
	})
	@Max(51, {
		message: "Last point must be under 51.",
	})
	lastPoint: number;
	@Min(1, {
		message: "Number of games must be bigger than 1.",
	})
	@Max(5, {
		message: "Number of games must be under 5.",
	})
	numberOfGames: number;
	ruleOfEventExtension?: string;
	@IsNumber()
	@Min(0, {
		message: "Maximum athlete must be positive number.",
	})
	maximumAthlete: number;
	@IsNumber()
	@Min(0, {
		message: "Minimum athlete must be positive number.",
	})
	minimumAthlete: number;
	@IsEnum(BadmintonParticipantType, {
		message:
			"Participant type must be one of the following: " +
			"MENS_SINGLE, " +
			"WOMENS_SINGLE, " +
			"MENS_DOUBLE, " +
			"WOMENS_DOUBLE, " +
			"MIXED_DOUBLE",
	})
	tournamentEvent: BadmintonParticipantType;

	@IsNotEmpty({
		message: "Championship prize must exist!",
	})
	championshipPrize: string;
	@IsNotEmpty({
		message: "Runner-up prize must exist!",
	})
	runnerUpPrize: string;
	thirdPlacePrize?: string;
	jointThirdPlacePrize?: string;
}

export class CreateTournamentEventsDTO {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => Object)
	createTournamentEvent: {
		[key in BadmintonParticipantType]: CreateTournamentEvent[];
	}[];
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
	@MaxLength(512, {
		message: "Introduction maximum is under 512 characters.",
	})
	introduction: string;

	@IsString()
	@MaxLength(512, {
		message: "Description maximum is under 512 characters.",
	})
	description: string;
	@IsString()
	@IsPhoneNumber("VN")
	contactPhone: string;
	@IsString()
	@IsEmail()
	contactEmail: string;

	@IsString()
	backgroundTournament: string;
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

	@IsNumber()
	@Min(0, {
		message: "Prize pool must be positive value!",
	})
	@Max(1000000000, {
		message: "Prize pool must be under 1.000.000.000VND!",
	})
	prizePool: number;

	@IsString()
	@IsNotEmpty()
	location: string;

	@IsNumber()
	@Min(0, {
		message: "Registration fee per person must be positive value!",
	})
	@Max(1000000000, {
		message: "Registration fee per person must be under 1.000.000.000VND!",
	})
	registrationFeePerPerson: number;

	@IsNumber()
	@Min(0, {
		message: "Registration fee per pair must be positive value!",
	})
	@Max(1000000000, {
		message: "Registration fee per pair must be under 1.000.000.000VND!",
	})
	registrationFeePerPair: number;

	@IsNumber()
	@Min(1)
	maxEventPerPerson: number;

	tournamentSerieId?: string;

	createTournamentEvent: CreateTournamentEventsDTO;

	@IsNumber()
	@Max(1000000000, {
		message: "Protest fee per time must be under 1.000.000.000VND.",
	})
	protestFeePerTime: number | 0;

	@IsDateString()
	@IsISO8601()
	checkInBeforeStart: Date;

	@IsBoolean()
	hasMerchandise: boolean;
	@IsNumber()
	@Min(0, {
		message: "Number of merchandise must be positive value!",
	})
	@Max(1000000, {
		message: "Number of merchandises must be under 1.000.000!",
	})
	numberOfMerchandise: number;
	merchandiseImages: string[];
	@IsNumber()
	@Min(1, {
		message: "Umpire per match must be more than 1.",
	})
	umpirePerMatch: number;

	@IsArray()
	@IsEnum(RequiredAttachment, {
		message:
			"Required attachment must be one of the following: " +
			"IDENTIFICATION_CARD, " +
			"PORTRAIT_PHOTO",
		each: true,
	})
	requiredAttachment: RequiredAttachment[];
	isRecruit: boolean;
	isPrivate: boolean;
	isRegister: boolean;
	isLiveDraw: boolean;
	hasLiveStream: boolean;
}

export class UpdateTournament {
	@IsString()
	@IsNotEmpty()
	id: string;

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@Allow()
	shortName: string;
	@IsString()
	@MaxLength(512, {
		message: "Description maximum is under 512 characters.",
	})
	description: string;
	@IsString()
	@IsPhoneNumber("VN")
	contactPhone: string;
	@IsString()
	@IsEmail()
	contactEmail: string;

	@IsString()
	backgroundTournament: string;
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

	@IsNumber()
	@Max(1000000000, {
		message: "Prize pool must be smaller than 1.000.000.000VND.",
	})
	prizePool: number;

	@IsString()
	@IsNotEmpty()
	location: string;

	@IsNumber()
	@Min(0, {
		message: "Registration fee per person must be positive value!",
	})
	@Max(1000000000, {
		message: "Registration fee per person must be under 1.000.000.000VND!",
	})
	registrationFeePerPerson: number;

	@IsNumber()
	@Min(0, {
		message: "Registration fee per pair must be positive value!",
	})
	@Max(1000000000, {
		message: "Registration fee per pair must be under 1.000.000.000VND!",
	})
	registrationFeePerPair: number;

	@IsNumber()
	@Min(1)
	maxEventPerPerson: number;

	@IsNumber()
	@Max(1000000000, {
		message: "Protest fee per time must be under 1.000.000.000VND.",
	})
	protestFeePerTime: number | 0;

	@IsDateString()
	@IsISO8601()
	checkInBeforeStart: Date;

	@IsBoolean()
	hasMerchandise: boolean;
	@IsNumber()
	@Min(0, {
		message: "Number of merchandise must be positive value!",
	})
	@Max(1000000, {
		message: "Number of merchandise must be under 1.000.000!",
	})
	numberOfMerchandise: number;
	merchandiseImages: string[];
	@IsNumber()
	@Min(1, {
		message: "Umpire per match must be more than 1.",
	})
	umpirePerMatch: number;

	@IsArray()
	@IsEnum(RequiredAttachment, {
		message:
			"Required attachment must be one of the following: " +
			"IDENTIFICATION_CARD, " +
			"PORTRAIT_PHOTO",
		each: true,
	})
	requiredAttachment: RequiredAttachment[];
	isRecruit: boolean;
	isPrivate: boolean;
	isRegister: boolean;
	isLiveDraw: boolean;
	hasLiveStream: boolean;
}
