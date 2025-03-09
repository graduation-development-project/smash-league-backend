import { TournamentSerie } from "@prisma/client";
import { ICreateTournamentSerie } from "../interfaces/tournament/tournament.interface";
import { IModifyTournamentSerie } from "../interfaces/tournament-serie/tournament-serie.interface";

export interface TournamentSerieRepositoryPort {
	getTournamentSeries() : Promise<TournamentSerie[]>;
	getTournamentSerie(id: string) : Promise<TournamentSerie | null>;
	createTournamentSerie(createTournamentSerie: ICreateTournamentSerie) : Promise<TournamentSerie>;
	getAllTournamentOfTournamentSerie(tournamentSerieId: string) : Promise<TournamentSerie>;
	modifyTournamentSerie(modifyTournamentSerie: IModifyTournamentSerie) : Promise<TournamentSerie>;

}