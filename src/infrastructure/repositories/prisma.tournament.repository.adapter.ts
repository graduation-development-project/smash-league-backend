import { PrismaClient, Tournament, TournamentStatus } from "@prisma/client";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";
import { Injectable } from "@nestjs/common";
import { ICreateTournament } from "src/domain/interfaces/tournament/tournament.interface";

@Injectable()
export class PrismaTournamentRepositorAdapter implements TournamentRepositoryPort {
	constructor(private prisma: PrismaClient) {	
	}

	async createTournament(tournament: ICreateTournament): Promise<Tournament> {
		return await this.prisma.tournament.create({
			data: {
				...tournament,
				organizerId: "b852c0f2-0019-4d67-b547-6a276f7ba35a",
        status: TournamentStatus.CREATED, // Make sure this matches TournamentStatus enum
        tournamentSerieId: "asdasd", // Must be a valid tournamentSerie ID
			}
		})
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