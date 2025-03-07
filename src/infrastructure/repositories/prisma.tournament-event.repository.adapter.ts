import { Injectable } from "@nestjs/common";
import { PrismaClient, Tournament, TournamentEvent } from "@prisma/client";
import { ICreateTournamentEvent } from "src/domain/interfaces/tournament/tournament.interface";
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";

@Injectable()
export class PrismaTournamentEventRepositoryAdapter implements TournamentEventRepositoryPort {
	constructor(
		private prisma: PrismaClient
	){
	}
	async createMultipleTournamentEvent(tournamentEvents: ICreateTournamentEvent[],
																			tournamentId: string
	): Promise<any> {
		const events = Object.values(tournamentEvents).map((event) => ({
			...event,
			tournamentId: tournamentId
		}));
		console.log(events);
		const tournaments: TournamentEvent[] = await this.prisma.tournamentEvent.createManyAndReturn({
			data: events,
			skipDuplicates: true
		})
		return [];
	}

	async getAllTournamentEvent(tournamentId: string): Promise<TournamentEvent[]> {
		return await this.prisma.tournamentEvent.findMany({
			where: {
				tournamentId: tournamentId
			}
		});
	}
	getAllTournamentEventOfUser(userId: string, tournamentId: string): Promise<TournamentEvent[]> {
		throw new Error("Method not implemented.");
	}
	createNewTournamentEvent(): Promise<any> {
		throw new Error("Method not implemented.");
	}
	
}