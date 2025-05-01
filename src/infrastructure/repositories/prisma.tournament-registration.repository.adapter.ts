import { Injectable } from "@nestjs/common";
import {
	TournamentRegistration,
	TournamentRegistrationStatus,
} from "@prisma/client";
import { TournamentRegistrationRepositoryPort } from "../../domain/repositories/tournament-registration.repository.port";
import { PrismaService } from "../services/prisma.service";
import { RegisterTournamentDTO } from "../../domain/dtos/athletes/register-tournament.dto";
import { CreateTournamentRegistrationDTO } from "../../domain/dtos/tournament-registration/create-tournament-registration.dto";

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
					isDeleted: false,
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

	createTournamentRegistration(
		createTournamentRegistrationDTO: CreateTournamentRegistrationDTO,
	): Promise<TournamentRegistration> {
		try {
			return this.prismaService.tournamentRegistration.create({
				data: createTournamentRegistrationDTO,
			});
		} catch (e) {
			throw e;
		}
	}

	async removeTournamentRegistration(
		tournamentRegistrationId: string,
	): Promise<void> {
		try {
			await this.prismaService.tournamentRegistration.update({
				where: {
					id: tournamentRegistrationId,
				},
				data: {
					isDeleted: true,
				},
			});
			return;
		} catch (e) {
			console.error("remove tournament registration failed", e);
			throw e;
		}
	}

	async removeManyTournamentRegistration(
		tournamentRegistrationIds: string[],
	): Promise<void> {
		try {
			await this.prismaService.tournamentRegistration.updateMany({
				where: {
					id: {
						in: tournamentRegistrationIds,
					},
				},
				data: {
					isDeleted: true,
				},
			});
			return;
		} catch (e) {
			console.error("remove many tournament registration failed", e);
			throw e;
		}
	}

	async getTournamentRegistrationListByEvent(
		tournamentId: string,
		tournamentEventId: string,
	): Promise<TournamentRegistration[]> {
		try {
			return await this.prismaService.tournamentRegistration.findMany({
				where: {
					tournamentId,
					tournamentEventId,
				},
			});
		} catch (e) {
			console.error("getTournamentRegistrationListByEvent failed", e);
			throw e;
		}
	}

	async cancelManyTournamentRegistration(
		tournamentRegistrationIds: string[],
	): Promise<void> {
		try {
			await this.prismaService.tournamentRegistration.updateMany({
				where: {
					id: {
						in: tournamentRegistrationIds,
					},
				},
				data: {
					status: TournamentRegistrationStatus.REJECTED,
				},
			});
		} catch (e) {
			console.error("cancelManyTournamentRegistration failed", e);
			throw e;
		}
	}
}
