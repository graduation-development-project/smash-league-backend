import { IUserDefaultResponse } from "../user/user.interface";

export interface IModifyTournamentSerie {
	id: string;
	tournamentSerieName: string;
	serieBackgroundImageURL: string;
	
}

export interface ICreateTournamentSerieOnly {
	tournamentSerieName: string;
	serieBackgroundImageURL: string;
	belongsToUserId: string;
}

export interface ITournamentSerieResponse {
	id: string;
	tournamentSerieName: string;
	serieBackgroundImageURL: string;
	belongsToUser: IUserDefaultResponse
}