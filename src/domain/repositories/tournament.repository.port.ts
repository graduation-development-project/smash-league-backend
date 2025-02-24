import { PropertyMetadata } from "@nestjs/core/injector/instance-wrapper";
import { Tournament } from "@prisma/client";
import { TournamentEntity } from "../entities/tournament/tournament.entity";

export interface TournamentRepositoryPort {
	createTournament(): Promise<Tournament>;
	getAllTournament(): Promise<Tournament[]>;
	filterTournament(): Promise<Tournament[]>;
	getTournamentDetail(tournamentId: string): Promise<Tournament>;
}