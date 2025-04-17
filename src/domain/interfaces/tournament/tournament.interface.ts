import {
	BadmintonParticipantType,
	Tournament,
	TournamentEvent,
	TournamentParticipants,
	TournamentRegistration,
} from "@prisma/client";
import { Type } from "class-transformer";
import {
	Allow,
	IS_ISO8601,
	IsArray,
	IsBoolean,
	IsDateString,
	IsEnum,
	IsISO8601,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
	ValidateIf,
	ValidateNested,
} from "class-validator";
import { IOrganizerResponse } from "../user/organizer.interface";
import { ITournamentSerieResponse } from "../tournament-serie/tournament-serie.interface";

export enum FormatType {
	SINGLE_ELIMINATION = "SINGLE_ELIMINATION",
	ROUND_ROBIN = "ROUND_ROBIN",
}

export enum TournamentStatus {
	Opening = "OPENING",
	Opening_For_Registration = "OPENING_FOR_REGISTRATION",
	Drawing = "DRAWING",
	On_Going = "ON_GOING",
	Finished = "FINISHED",
}

export enum RequiredAttachment {
	Identification_Card = "IDENTIFICATION_CARD",
	Portrait_Photo = "PORTRAIT_PHOTO",
}

export interface ICreateTournamentSerie {
	tournamentSerieName: string;
	belongsToUserId: string;
}

export interface ICreateTournamentEvent {
	fromAge?: number;

	toAge?: number;
	typeOfFormat: FormatType;

	winningPoint?: number;

	lastPoint: number;

	numberOfGames: number;
	ruleOfEventExtension?: string;
	maximumAthlete: number;
	minimumAthlete: number;
	tournamentEvent: BadmintonParticipantType;

	championshipPrize: string;
	runnerUpPrize: string;
	thirdPlacePrize?: string;
	jointThirdPlacePrize?: string;
}

export interface ICreateTournament {
	id: string;
	name: string;
	shortName?: string;
	description: string;
	introduction: string;
	organizerId: string;
	contactPhone: string;
	contactEmail: string;
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

	tournamentSerieId: string;

	protestFeePerTime: number | 0;

	checkInBeforeStart: Date;

	hasMerchandise: boolean;
	numberOfMerchandise: number;
	merchandiseImages: string[];
	umpirePerMatch: number;
	requiredAttachment: RequiredAttachment[];
	isRecruit: boolean;
	isPrivate: boolean;
	isRegister: boolean;
	isLiveDraw: boolean;
	hasLiveStream: boolean;
}

export interface IParticipatedTournamentResponse {
	tournament: Tournament;
	registrations: TournamentRegistration[];
}

export interface ITournamentRegistrationResponse {
	tournamentEvent: TournamentEvent;
	registrations: TournamentRegistration[];
}

export interface ITournamentParticipantsResponse {
	tournamentEvent: TournamentEvent;
	participants: TournamentParticipants[];
}

// const ParticipantTypeMap = {
// 	MENS_SINGLE: "MENS_SINGLE",
// 	WOMENS_SINGLE: "WOMENS_SINGLE",
// 	MENS_DOUBLE: "MENS_DOUBLE",
// 	WOMENS_DOUBLE: "WOMENS_DOUBLE",
// 	MIXED_DOUBLE: "MIXED_DOUBLE"
// } as const;
// type ParticipantType = (typeof ParticipantTypeMap)[keyof typeof ParticipantTypeMap];

export interface ITournamentResponse {
	id: string;
	name: string;
	shortName: string;
	organizer: IOrganizerResponse;
	mainColor: string;
	backgroundTournament: string;
	location: string;
	registrationOpeningDate: Date;
	expiredTimeLeft: string;
	registrationClosingDate: Date;
	drawDate: Date;
	startDate: Date;
	endDate: Date;
	checkInBeforeStart: Date;
	umpirePerMatch: number;
	registrationFeePerPerson: number;
	registrationFeePerPair: number;
	maxEventPerPerson: number;
	protestFeePerTime: number;
	hasMerchandise: boolean;
	numberOfMerchandise: number;
	merchandiseImages: string[];
	requiredAttachment: string[];
	tournamentSerie: ITournamentSerieResponse;
}

export interface ITournamentEventDetail {
	fromAge: number;
	toAge: number;
	id: string;
	tournamentEvent: string;
	numberOfGames: number;
	typeOfFormat: string;
	winningPoint: number;
	lastPoint: number;
	championshipPrize: string;
	runnerUpPrize: string;
	thirdPlacePrize?: string;
	jointThirdPlacePrize?: string;
	ruleOfEventExtension: string;
}

export interface ITournamentDetailResponse {
	id: string;
	name: string;
	shortName: string;
	mainColor: string;
	description: string,
	introduction: string,
	backgroundTournament: string;
	checkInBeforeStart: Date;
	registrationOpeningDate: Date;
	registrationClosingDate: Date;
	drawDate: Date;
	startDate: Date;
	endDate: Date;
	organizer: {
		id: string;
		name: string;
		avatarURL: string;
		phoneNumber: string;
		email: string;
	};
	contactEmail: string;
	contactPhone: string;
	// numberOfMerchandise: true,
	hasMerchandise: boolean;
	hasLiveStream: boolean;
	hasPost: boolean;
	location: string;
	registrationFeePerPerson: number;
	registrationFeePerPair: number;
	maxEventPerPerson: number;
	prizePool: number;
	requiredAttachment: string[];
	protestFeePerTime: number;
	liveStreamRooms: string[];
	tournamentSerie: {
		id: string;
		tournamentSerieName: string;
		serieBackgroundImageURL: string;
	};
	tournamentEvents: {
		[tournamentEventName: string]: {
			fromAge: number;
			toAge: number;
			id: string;
		}[];
	};
}

export interface IUpdateTournament {
	id: string;
	name: string;
	shortName: string;
	contactPhone: string;
	contactEmail: string;
	mainColor: string;
	backgroundTournament: string;
	location: string;
	registrationOpeningDate: Date;
	registrationClosingDate: Date;
	drawDate: Date;
	startDate: Date;
	endDate: Date;
	checkInBeforeStart: Date;
	umpirePerMatch: number;
	registrationFeePerPerson: number;
	registrationFeePerPair: number;
	maxEventPerPerson: number;
	protestFeePerTime: number;
	hasMerchandise: boolean;
	numberOfMerchandise: number;
	merchandiseImages: string[];
	requiredAttachment: string[];
}

export interface IUpdateTournamentInformation {
	id: string;
	name: string;
	shortName: string;
	mainColor: string;
	backgroundTournament: string;
	location: string;
	prizePool: number;
	introduction: string;
	description: string;
}

export interface IUpdateTournamentContact {
	id: string;
	contactPhone: string;
	contactEmail: string;
}

export interface ITournamentInformation {
	id: string;
	name: string;
	shortName: string;
	mainColor: string;
	backgroundTournament: string;
	location: string;
	prizePool: number;
	introduction: string;
	description: string;
}

export interface ITournamentContact {
	id: string;
	contactPhone: string;
	contactEmail: string;
}

export interface IUpdateTournamentRegistrationInformation {
	id: string;

	registrationFeePerPerson: number;

	registrationFeePerPair: number;

	protestFeePerTime: number | 0;

	registrationOpeningDate: Date;

	registrationClosingDate: Date;
	requiredAttachment: RequiredAttachment[];
}

export interface ITournamentRegistrationInformation {
	id: string;

	registrationFeePerPerson: number;

	registrationFeePerPair: number;

	protestFeePerTime: number | 0;

	registrationOpeningDate: Date;

	registrationClosingDate: Date;
	requiredAttachment: string[];
}