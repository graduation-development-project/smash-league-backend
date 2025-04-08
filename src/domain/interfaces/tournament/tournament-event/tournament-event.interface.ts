import { KeyValueType } from "src/domain/dtos/key-value-type.type";
import { IParticipantsByTournamentEventResponse, IParticipantsResponse } from "../../user/athlete.interface";
import { IUserDefaultResponse } from "../../user/user.interface";

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