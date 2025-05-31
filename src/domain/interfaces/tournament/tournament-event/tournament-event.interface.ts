import { KeyValueType } from "src/domain/dtos/key-value-type.type";
import { IParticipantsByTournamentEventResponse, IParticipantsResponse } from "../../user/athlete.interface";
import { IUserDefaultResponse } from "../../user/user.interface";
import { TournamentEventStatus } from "@prisma/client";

export interface ITournamentEventParticipants {
	numberOfParticipants: number;
	listParticipants: IParticipantsResponse[];
}

export interface IParticipantsOfTournamentEvent {
	numberOfParticipants: number;
	listParticipants: IParticipantsByTournamentEventResponse[];
}

export interface ITournamentEventDetailResponse {
	id: string;
	tournamentEvent: string;
	fromAge: number;
	toAge: number;
	typeOfFormat: string;
}

export interface ITournamentEventDetailWithPrizeAndConditionResponse {
	id: string;
	tournamentEvent: string;
	fromAge: number;
	toAge: number;
	typeOfFormat: string;
	minimumAthlete: number;
	maximumAthlete: number;
	tournamentEventStatus: string;
	winningPoint: number;
	lastPoint: number;
	prizes: IPrizeResponse[];
	conditions: IConditionResponse[];
	needToUpdatePrize: boolean;
}

export interface IPrizeResponse {
	id: string;
	prizeName: string;
	prizeDetail: string;
	prizeType: string;
}

export interface IConditionResponse {
	id: string;
	conditionName: string;
	conditionDescription: string;
	conditionType: string;
} 