import { Injectable } from "@nestjs/common";
import {
	TournamentRegistration,
	TournamentRegistrationStatus,
} from "@prisma/client";
import { TournamentRegistrationRepositoryPort } from "../../domain/repositories/tournament-registration.repository.port";
import { PrismaService } from "../services/prisma.service";

@Injectable()
export class PrismaTournamentRegistrationRepositoryAdapter
	implements TournamentRegistrationRepositoryPort
{
	constructor(private prismaService: PrismaService) {}

	getTournamentRegistrationById(
		tournamentRegistrationId: string,
	): Promise<TournamentRegistration> {
		try {
			return this.prismaService.tournamentRegistration.findUnique({
				where: {
					id: tournamentRegistrationId,
				},

				include: {
					tournament: true,
					tournamentEvent: true,
				},
			});
		} catch (e) {
			console.error("Get tournament registration by id failed", e);
			throw e;
		}
	}

	async updateStatus(
		tournamentRegistrationId: string,
		status: TournamentRegistrationStatus,
	): Promise<TournamentRegistration> {
		try {
			return this.prismaService.tournamentRegistration.update({
				where: {
					id: tournamentRegistrationId,
				},
				data: {
					status,
				},
			});
		} catch (e) {
			console.error("Update tournament registration status failed", e);
			throw e;
		}
	}
}
