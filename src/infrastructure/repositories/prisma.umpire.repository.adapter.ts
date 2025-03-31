import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { UmpireRepositoryPort } from "../../domain/interfaces/repositories/umpire.repository.port";
import { UmpireUpdateMatchDTO } from "../../domain/dtos/umpire/umpire-update-match.dto";

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
}
