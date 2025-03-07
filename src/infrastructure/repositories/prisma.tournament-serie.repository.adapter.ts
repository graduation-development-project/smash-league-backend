import { Injectable } from "@nestjs/common";
import { PrismaClient, Tournament, TournamentSerie } from "@prisma/client";
import { ICreateTournamentSerie } from "src/domain/interfaces/tournament/tournament.interface";
import { TournamentSerieRepositoryPort } from "src/domain/repositories/tournament-serie.repository.port";

@Injectable()
export class PrismaTournamentSerieRepositoryAdapter implements TournamentSerieRepositoryPort {
	constructor(
		private prisma: PrismaClient
	) {
	}
	async getTournamentSeries(): Promise<TournamentSerie[]> {
		return await this.prisma.tournamentSerie.findMany();
	}
	async getTournamentSerie(id: string): Promise<TournamentSerie | null> {
		return await this.prisma.tournamentSerie.findFirst({
			where: {
				id: id
			}
		});
	}

	async getAllTournamentOfTournamentSerie(tournamentSerieId: string) : Promise<TournamentSerie | null> {
		return await this.prisma.tournamentSerie.findUnique({
			where: {
				id: tournamentSerieId
			},
			select: {
				id: true,
				tournamentSerieName: true, 
				serieBackgroundImageURL: true,
				tournaments: {
				}
			}
		});
	}

	async createTournamentSerie(createTournamentSerie: ICreateTournamentSerie): Promise<TournamentSerie> {
		// console.log({
		// 	tournamentSerie: createTournamentSerie,
		// 	serieBackgroundImageURL: "https://png.pngtree.com/background/20210711/original/pngtree-promotional-red-badminton-background-material-picture-image_1081592.jpg"
		// });
		// return null;
		return await this.prisma.tournamentSerie.create({
			data: {
				...createTournamentSerie,
				serieBackgroundImageURL: "https://png.pngtree.com/background/20210711/original/pngtree-promotional-red-badminton-background-material-picture-image_1081592.jpg"
			}
		});
	}
	
}