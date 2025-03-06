import { TournamentSerie } from "@prisma/client";
import { ICreateTournamentSerie } from "../interfaces/tournament/tournament.interface";

export interface TournamentSerieRepositoryPort {
	getTournamentSeries() : Promise<TournamentSerie[]>;
	getTournamentSerie(id: string) : Promise<TournamentSerie | null>;
	createTournamentSerie(createTournamentSerie: ICreateTournamentSerie) : Promise<TournamentSerie>;
}