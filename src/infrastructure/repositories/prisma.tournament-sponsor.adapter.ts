import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { TournamentSponsorRepositoryPort } from "../../domain/repositories/tournament-sponsor.repository.port";
import { SponsorTier, TournamentSponsor } from "@prisma/client";
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

	async findSponsorInTournament(tournamentId: string): Promise<any> {
		try {
			const tournamentSponsors =
				await this.prismaService.tournamentSponsor.findMany({
					where: {
						tournamentId,
					},
					include: {
						sponsor: true,
					},
				});

			const groupedSponsorsMap: Record<
				SponsorTier,
				{ name: string; logo?: string | null }[]
			> = {
				DIAMOND: [],
				PLATINUM: [],
				GOLD: [],
				SILVER: [],
				BRONZE: [],
				OTHER: [],
			};

			tournamentSponsors.forEach((ts) => {
				groupedSponsorsMap[ts.tier].push({
					name: ts.sponsor.name,
					logo: ts.sponsor.logo,
				});
			});

			return Object.entries(groupedSponsorsMap)
				.map(([tier, sponsors]) => ({
					tier: tier as SponsorTier,
					sponsors: sponsors,
				}))
				.filter((group) => group.sponsors.length > 0);
		} catch (e) {
			console.error("findSponsorInTournament failed", e);
			throw e;
		}
	}

	async editTournamentSponsorTier(
		tournamentId: string,
		sponsorId: string,
		tier: SponsorTier,
	): Promise<TournamentSponsor> {
		try {
			return this.prismaService.tournamentSponsor.update({
				where: {
					tournamentId_sponsorId: {
						tournamentId,
						sponsorId,
					},
				},

				data: {
					tier,
				},
			});
		} catch (e) {
			console.error("editTournamentSponsorTier failed", e);
			throw e;
		}
	}

	async removeTournamentSponsor(
		tournamentId: string,
		sponsorId: string,
	): Promise<void> {
		try {
			await this.prismaService.tournamentSponsor.delete({
				where: {
					tournamentId_sponsorId: {
						tournamentId,
						sponsorId,
					},
				},
			});
		} catch (e) {
			console.error("removeTournamentSponsor failed", e);
			throw e;
		}
	}

	async findTournamentSponsor(
		tournamentId: string,
		sponsorId: string,
	): Promise<TournamentSponsor> {
		try {
			return this.prismaService.tournamentSponsor.findUnique({
				where: {
					tournamentId_sponsorId: {
						tournamentId,
						sponsorId,
					},
				},
			});
		} catch (e) {
			console.error("findTournamentSponsor failed", e);
			throw e;
		}
	}
}
