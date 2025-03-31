import { Injectable } from "@nestjs/common";
import { PrismaClient, Tournament, TournamentSerie } from "@prisma/client";
import { IPaginatedOutput, IPaginateOptions } from "src/domain/interfaces/interfaces";
import { ICreateTournamentSerieOnly, IModifyTournamentSerie, ITournamentSerieResponse } from "src/domain/interfaces/tournament-serie/tournament-serie.interface";
import { ICreateTournamentSerie } from "src/domain/interfaces/tournament/tournament.interface";
import { TournamentSerieRepositoryPort } from "src/domain/repositories/tournament-serie.repository.port";

@Injectable()
export class PrismaTournamentSerieRepositoryAdapter implements TournamentSerieRepositoryPort {
	constructor(
		private prisma: PrismaClient
	) {
	}
	async getTournamentSerieByUserId(userId: string): Promise<ITournamentSerieResponse[]> {
		return await this.prisma.tournamentSerie.findMany({
			where: {
				belongsToUserId: {
					equals: userId
				}
			},
			select: {
				id: true,
				tournamentSerieName: true,
				serieBackgroundImageURL: true,
				belongsToUser: {
					select: {
						id: true,
						name: true,
						email: true,
						phoneNumber: true
					}
				}
			}
		})
	}
	async countPageTournament(options: IPaginateOptions): Promise<number> {
		return await this.prisma.tournament.count() / options.perPage;
	}
	async queryTournamentByTournamentSerie(id: string, options: IPaginateOptions): Promise<IPaginatedOutput<Tournament>> {
		const tournaments = await this.prisma.tournament.findMany({
			where: {
				tournamentSerieId: id
			},
			skip: (options.page - 1) * options.perPage,
			take: options.perPage
		});
		const lastPage = await this.countPageTournament(options);
		return {
			data: tournaments,
			meta: {
				currentPage: options.page,
				lastPage: lastPage,
				nextPage: (options.page + 1 >= lastPage) ? lastPage: options.page + 1,
				prevPage: (options.page - 1 <= 1) ? 1: options.page - 1,
				totalPerPage: options.perPage,
				total: tournaments.length
			}
		};
	}
	async getTournamentSerieByName(userId: string, name: string): Promise<TournamentSerie> {
		return await this.prisma.tournamentSerie.findFirst({
			where: {
				tournamentSerieName: {
					equals: name
				},
				belongsToUserId: {
					equals: userId
				}
			}
		});
	}
	async createTournamentSerieOnly(createTournamentSerie: ICreateTournamentSerieOnly) : Promise<TournamentSerie> {
		return await this.prisma.tournamentSerie.create({
			data: {
				...createTournamentSerie
			}
		});
	}
	async modifyTournamentSerie(modifyTournamentSerie: IModifyTournamentSerie): Promise<TournamentSerie> {
		return await this.prisma.tournamentSerie.update({
			where: {
				id: modifyTournamentSerie.id
			},
			data: {
				...modifyTournamentSerie
			}
		});
	}
	async getTournamentSeries(): Promise<ITournamentSerieResponse[]> {
		return await this.prisma.tournamentSerie.findMany({
			select: {
				id: true,
				tournamentSerieName: true,
				serieBackgroundImageURL: true,
				belongsToUser: {
					select: {
						id: true,
						name: true,
						phoneNumber: true,
						email: true
					}
				}
			}
		});
	}
	async getTournamentSerie(id: string): Promise<TournamentSerie | null> {
		return await this.prisma.tournamentSerie.findFirst({
			where: {
				id: id
			}
		});
	}

	async getAllTournamentOfTournamentSerie(tournamentSerieId: string) : Promise<ITournamentSerieResponse | null> {
		return await this.prisma.tournamentSerie.findUnique({
			where: {
				id: tournamentSerieId
			},
			select: {
				id: true,
				tournamentSerieName: true, 
				serieBackgroundImageURL: true,
				tournaments: {
				},
				belongsToUser: {
					select: {
						id: true,
						name: true,
						phoneNumber: true,
						email: true
					}
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