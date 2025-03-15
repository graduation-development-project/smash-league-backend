export interface IModifyTournamentSerie {
	id: string;
	tournamentSerieName: string;
	serieBackgroundImageURL: string;
	
}

export interface ICreateTournamentSerieOnly {
	tournamentSerieName: string;
	serieBackgroundImageURL: string;
}