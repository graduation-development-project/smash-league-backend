import { PrismaClient, Tournament } from "@prisma/client";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";
import { Injectable } from "@nestjs/common";
import { ICreateTournament } from "src/domain/interfaces/tournament/tournament.interface";

@Injectable()
export class PrismaTournamentRepositorAdapter implements TournamentRepositoryPort {
	constructor(private prisma: PrismaClient) {	
	}

	async createTournament(tournament: ICreateTournament): Promise<ICreateTournament> {
		return tournament;

	}
	async getAllTournament(): Promise<Tournament[]> {
		const tournaments = await this.prisma.tournament.findMany();
  
		if (!tournaments || tournaments.length === 0) {
			return []; // Ensure an empty array is returned, avoiding undefined errors
		}
		return tournaments;
	}
	async filterTournament(): Promise<Tournament[]> {
		return await this.prisma.tournament.findMany();
	}
	async getTournamentDetail(tournamentId: string): Promise<Tournament> {
		return await this.prisma.tournament.findUnique({
			where: {
				id: tournamentId
			}
		});
	}
	
}