import { Tournament } from "@prisma/client";
import { Type } from "class-transformer";
import { Allow, IS_ISO8601, IsArray, IsBoolean, IsDateString, IsEnum, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateIf, ValidateNested } from "class-validator";


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

export interface ICreateTournamentSerie {
	tournamentSerieName: string;
}

export interface ICreateTournamentEvent {
	fromAge?: number;

	toAge?: number;
	formatType: FormatType;

	winningPoint?: number;

	lastPoint: number;

	numberOfGames: number;
	
	minimumParticipantToStart: number;

	participantType: ParticipantType;

	championshipPrize: string[];
	runnerUpPrize: string[];
	thirdPrize?: string[];
	jointThirdPrize?: string[];
}

export interface ICreateTournament {
	id: string; 
	name: string;
	shortName?: string;
	backgroundTournament: string;
	mainColor: string;

	registrationOpeningDate: Date;

	registrationClosingDate: Date;

	drawDate: Date;

	startDate: Date;

	endDate: Date;

	prizePool: number;

	location: string;

	registrationFeePerPerson: number;

	registrationFeePerPair: number;

	maxEventPerPerson: number;

	tournamentEventId?: string;

	protestFeePerTime: number | 0;

	checkInBeforeStart: Date;

	hasMerchandise: boolean;
	numberOfMerchandise: number;
	merchandiseImageContent: string[];
	merchandise: string;
	umpirePerMatch: number;
	linemanPerMatch: number;
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