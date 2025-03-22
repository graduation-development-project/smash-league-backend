import { IParticipantsResponse } from "../../user/athlete.interface";
import { IUserDefaultResponse } from "../../user/user.interface";

export interface ITournamentEventParticipants {
	numberOfParticipants: number;
	listParticipants: IParticipantsResponse[];
}