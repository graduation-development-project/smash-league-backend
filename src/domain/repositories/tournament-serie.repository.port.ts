import { TournamentSerie } from "@prisma/client";
import { ICreateTournamentSerieOnly, IModifyTournamentSerie } from "../interfaces/tournament-serie/tournament-serie.interface";
import { ICreateTournamentSerie } from "../interfaces/tournament/tournament.interface";

export interface TournamentSerieRepositoryPort {
	createTournamentSerieOnly(createTournamentSerie: ICreateTournamentSerieOnly);
	getTournamentSeries() : Promise<TournamentSerie[]>;
	getTournamentSerieByName(name: string) : Promise<TournamentSerie>;
	getTournamentSerie(id: string) : Promise<TournamentSerie | null>;
	createTournamentSerie(createTournamentSerie: ICreateTournamentSerie) : Promise<TournamentSerie>;
	getAllTournamentOfTournamentSerie(tournamentSerieId: string) : Promise<TournamentSerie>;
	modifyTournamentSerie(modifyTournamentSerie: IModifyTournamentSerie) : Promise<TournamentSerie>;

	
}