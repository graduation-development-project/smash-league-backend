import { Injectable } from "@nestjs/common";
import { PrismaClient, Tournament } from "@prisma/client";


import { TournamentsRepositoryPort } from "../../domain/repositories/tournaments.repository";

@Injectable()
export class PrismaTournamentsRepositoryAdapter implements TournamentsRepositoryPort {

	constructor(private prisma: PrismaClient) {
	}

	async searchTournaments(searchTerm: string): Promise<Tournament[]> {
		return this.prisma.tournament.findMany({
			where: {
				OR: [
					{
						name: {
							contains: searchTerm,
							mode: "insensitive",
						},
					},
					{
						shortName: {
							contains: searchTerm,
							mode: "insensitive",
						},
					},
				],
			},
			orderBy: {
				name: "asc",
			},
		});
	}


}
