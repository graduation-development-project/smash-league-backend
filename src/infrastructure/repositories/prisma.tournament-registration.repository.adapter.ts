import { Injectable } from "@nestjs/common";
import {
	TournamentRegistration,
	TournamentRegistrationStatus,
} from "@prisma/client";
import { TournamentRegistrationRepositoryPort } from "../../domain/repositories/tournament-registration.repository.port";
import { PrismaService } from "../services/prisma.service";
import { RegisterTournamentDTO } from "../../domain/dtos/athletes/register-tournament.dto";
import { CreateTournamentRegistrationDTO } from "../../domain/dtos/tournament-registration/create-tournament-registration.dto";
import { GetRegistrationStatsInput } from "../../domain/interfaces/interfaces";
import {
	format,
	startOfDay,
	startOfMonth,
	startOfWeek,
	startOfYear,
	subDays,
} from "date-fns";

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
					user: true,
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

	async getRegistrationCountByPeriod({
		organizerId,
		period,
		fromDate,
		toDate,
	}: GetRegistrationStatsInput): Promise<Record<string, number>> {
		try {
			const effectiveFromDate = fromDate
				? startOfDay(fromDate)
				: startOfDay(new Date());

			let filterFromDate = effectiveFromDate;
			if (period === "daily") {
				filterFromDate = subDays(effectiveFromDate, 6);
			}

			const registrations =
				await this.prismaService.tournamentRegistration.findMany({
					where: {
						tournament: {
							organizerId,
						},
						isDeleted: false,
						createdAt:
							period === "daily"
								? {
										gte: filterFromDate,
										lte: effectiveFromDate,
									}
								: {
										...(fromDate && { gte: fromDate }),
										...(toDate && { lte: toDate }),
									},
					},
					select: {
						createdAt: true,
					},
					orderBy: {
						createdAt: "asc",
					},
				});

			const grouped: Record<string, number> = {};

			if (period === "daily") {
				// Khởi tạo đủ 7 ngày
				for (let i = 6; i >= 0; i--) {
					const date = subDays(effectiveFromDate, i);
					const key = format(startOfDay(date), "yyyy-MM-dd");
					grouped[key] = 0;
				}
			}

			if (period === "monthly") {
				const year = fromDate
					? fromDate.getFullYear()
					: new Date().getFullYear();

				// Khởi tạo 12 tháng
				for (let month = 0; month < 12; month++) {
					const key = format(new Date(year, month, 1), "yyyy-MM");
					grouped[key] = 0;
				}
			}

			for (const reg of registrations) {
				const createdAt = reg.createdAt;
				let key: string;

				switch (period) {
					case "daily":
						key = format(startOfDay(createdAt), "yyyy-MM-dd");
						break;
					case "monthly":
						key = format(startOfMonth(createdAt), "yyyy-MM");
						break;
					default:
						throw new Error("Invalid period type");
				}

				if (!grouped[key]) {
					grouped[key] = 0;
				}
				grouped[key]++;
			}

			return grouped;
		} catch (e) {
			console.error("cancelManyTournamentRegistration failed", e);
			throw e;
		}
	}
}
