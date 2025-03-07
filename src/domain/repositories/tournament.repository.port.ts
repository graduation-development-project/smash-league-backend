import { PropertyMetadata } from "@nestjs/core/injector/instance-wrapper";
import { Tournament } from "@prisma/client";
import { ICreateTournament } from "../interfaces/tournament/tournament.interface";

export interface TournamentRepositoryPort {
	createTournament(tournament: ICreateTournament): Promise<Tournament>;
	getTournament(id: string) : Promise<Tournament | null>;
	getAllTournament(): Promise<Tournament[]>;
	filterTournament(): Promise<Tournament[]>;
	getTournamentDetail(tournamentId: string): Promise<Tournament>;
}