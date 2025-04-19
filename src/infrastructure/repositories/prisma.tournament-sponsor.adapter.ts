import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { TournamentSponsorRepositoryPort } from "../../domain/repositories/tournament-sponsor.repository.port";
import { Sponsor, TournamentSponsor } from "@prisma/client";
import { CreateTournamentSponsorDTO } from "../../domain/dtos/tournament-sponsor/create-tournament-sponsor.dto";

@Injectable()
export class PrismaTournamentSponsorAdapter
	implements TournamentSponsorRepositoryPort
{
	constructor(private prismaService: PrismaService) {}

	createNewTournamentSponsor(
		createTournamentSponsorDTO: CreateTournamentSponsorDTO[],
	): Promise<TournamentSponsor[]> {
		try {
			return this.prismaService.tournamentSponsor.createManyAndReturn({
				data: createTournamentSponsorDTO,
			});
		} catch (e) {
			console.error("Create tournament sponsor failed", e);
			throw e;
		}
	}

	async findSponsorInTournament(tournamentId: string): Promise<Sponsor[]> {
		try {
			const sponsorsData = await this.prismaService.tournamentSponsor.findMany({
				where: {
					tournamentId,
				},

				select: {
					sponsor: true,
				},
			});

			return sponsorsData.map((data) => data.sponsor);
		} catch (e) {
			console.error("findSponsorInTournament failed", e);
			throw e;
		}
	}
}
