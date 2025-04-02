import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { UmpireRepositoryPort } from "../../domain/repositories/umpire.repository.port";
import { UmpireUpdateMatchDTO } from "../../domain/dtos/umpire/umpire-update-match.dto";
import { Match, Tournament, TournamentUmpires } from "@prisma/client";

@Injectable()
export class PrismaUmpireRepositoryAdapter implements UmpireRepositoryPort {
	constructor(private prismaService: PrismaService) {}

	async umpireUpdateMatch(
		updateMatchDTO: UmpireUpdateMatchDTO,
	): Promise<string> {
		const {
			matchId,
			rightCompetitorAttendance,
			leftCompetitorAttendance,
			matchStatus,
			user,
		} = updateMatchDTO;

		try {
			console.log(user.id, matchId);
			const isUmpireForMatch = await this.prismaService.match.findUnique({
				where: {
					id: matchId,
					umpireId: user.id,
				},
			});

			if (!isUmpireForMatch) {
				throw new BadRequestException(
					"This umpire is not assign for this match",
				);
			}

			await this.prismaService.match.update({
				where: { id: matchId },
				data: {
					...(matchStatus && { matchStatus }),
					...(rightCompetitorAttendance && {
						rightCompetitorAttendance,
					}),
					...(leftCompetitorAttendance && {
						leftCompetitorAttendance,
					}),
				},
			});
			return "Update Match Successfully";
		} catch (e) {
			console.error("update match failed", e);
			throw e;
		}
	}

	async getAssignedMatches(
		umpireId: string,
		tournamentId: string,
	): Promise<Match[]> {
		try {
			return this.prismaService.match.findMany({
				where: {
					tournamentEvent: {
						tournamentId,
					},
					umpireId,
				},

				include: {
					tournamentEvent: {
						include: {
							tournament: true,
						},
					},
				},
			});
		} catch (e) {
			console.error("Get assigned match failed", e);
			throw e;
		}
	}

	async getParticipateTournaments(umpireId: string): Promise<Tournament[]> {
		try {
			const tournamentUmpireList =
				await this.prismaService.tournamentUmpires.findMany({
					where: {
						userId: umpireId,
					},
					select: {
						tournament: true,
					},
				});

			return tournamentUmpireList.map((tournament) => tournament.tournament);

		} catch (e) {
			console.error("Get Participate Tournaments failed", e);
			throw e;
		}
	}
}
