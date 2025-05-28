import { Injectable } from "@nestjs/common";
import {
	TournamentRegistration,
	TournamentRegistrationStatus,
	TransactionStatus,
} from "@prisma/client";
import { TournamentRegistrationRepositoryPort } from "../../domain/repositories/tournament-registration.repository.port";
import { PrismaService } from "../services/prisma.service";
import { RegisterTournamentDTO } from "../../domain/dtos/athletes/register-tournament.dto";
import { CreateTournamentRegistrationDTO } from "../../domain/dtos/tournament-registration/create-tournament-registration.dto";
import { GetRegistrationStatsInput } from "../../domain/interfaces/interfaces";
import {
	endOfWeek,
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
			const baseDate = fromDate ? fromDate : new Date();

			let filterFromDate: Date;
			let filterToDate: Date;

			if (period === "daily") {
				filterFromDate = startOfWeek(baseDate, { weekStartsOn: 1 }); // Monday
				filterToDate = endOfWeek(baseDate, { weekStartsOn: 1 }); // Sunday
			} else {
				filterFromDate = fromDate ? fromDate : undefined;
				filterToDate = toDate;
			}

			const registrations =
				await this.prismaService.tournamentRegistration.findMany({
					where: {
						tournament: {
							organizerId,
						},
						isDeleted: false,
						createdAt: {
							...(filterFromDate && { gte: filterFromDate }),
							...(filterToDate && { lte: filterToDate }),
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
				for (let i = 0; i < 7; i++) {
					const date = new Date(filterFromDate);
					date.setDate(date.getDate() + i);
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

	async getRevenueByPeriod({
		organizerId,
		period,
		fromDate,
		toDate,
	}: GetRegistrationStatsInput): Promise<Record<string, number>> {
		try {
			const baseDate = fromDate ? fromDate : new Date();

			let filterFromDate: Date;
			let filterToDate: Date;

			if (period === "daily") {
				filterFromDate = startOfWeek(baseDate, { weekStartsOn: 1 }); // Monday
				filterToDate = endOfWeek(baseDate, { weekStartsOn: 1 }); // Sunday
			} else {
				filterFromDate = fromDate ? fromDate : undefined;
				filterToDate = toDate;
			}

			console.log(organizerId);

			const transactions = await this.prismaService.transaction.findMany({
				where: {
					tournamentRegistration: {
						isDeleted: false,
						tournament: {
							organizerId,
						},
					},
					status: TransactionStatus.SUCCESSFUL,
					createdAt: {
						...(filterFromDate && { gte: filterFromDate }),
						...(filterToDate && { lte: filterToDate }),
					},
				},
				select: {
					createdAt: true,
					value: true,
				},

				orderBy: {
					createdAt: "asc",
				},
			});

			const grouped: Record<string, number> = {};

			if (period === "daily") {
				for (let i = 0; i < 7; i++) {
					const date = new Date(filterFromDate);
					date.setDate(date.getDate() + i);
					const key = format(startOfDay(date), "yyyy-MM-dd");
					grouped[key] = 0;
				}
			}

			if (period === "monthly") {
				const year = fromDate
					? fromDate.getFullYear()
					: new Date().getFullYear();
				for (let month = 0; month < 12; month++) {
					const key = format(new Date(year, month, 1), "yyyy-MM");
					grouped[key] = 0;
				}
			}

			for (const trx of transactions) {
				let key: string;

				switch (period) {
					case "daily":
						key = format(startOfDay(trx.createdAt), "yyyy-MM-dd");
						break;
					case "monthly":
						key = format(startOfMonth(trx.createdAt), "yyyy-MM");
						break;
					default:
						throw new Error("Invalid period type for revenue");
				}

				if (!grouped[key]) grouped[key] = 0;
				grouped[key] += trx.value;
			}

			return grouped;
		} catch (e) {
			console.error("getRevenueByPeriod failed", e);
			throw e;
		}
	}

	async countNumberOfRegistrationsInCurrentMonth(organizerId: string): Promise<{
		currentCount: number;
		previousCount: number;
		changeRate: number;
	}> {
		try {
			const now = new Date();

			const startOfCurrentMonth = new Date(
				now.getFullYear(),
				now.getMonth(),
				1,
			);
			const endOfCurrentMonth = new Date(
				now.getFullYear(),
				now.getMonth() + 1,
				0,
				23,
				59,
				59,
				999,
			);

			const startOfPreviousMonth = new Date(
				now.getFullYear(),
				now.getMonth() - 1,
				1,
			);
			const endOfPreviousMonth = new Date(
				now.getFullYear(),
				now.getMonth(),
				0,
				23,
				59,
				59,
				999,
			);

			const [currentCount, previousCount] = await Promise.all([
				this.prismaService.tournamentRegistration.count({
					where: {
						createdAt: {
							// gte: startOfCurrentMonth,
							lte: endOfCurrentMonth,
						},
						tournament: {
							organizerId,
						},

						status: TournamentRegistrationStatus.APPROVED,
					},
				}),
				this.prismaService.tournamentRegistration.count({
					where: {
						createdAt: {
							// gte: startOfPreviousMonth,
							lte: endOfPreviousMonth,
						},
						status: TournamentRegistrationStatus.APPROVED,

						tournament: {
							organizerId,
						},
					},
				}),
			]);

			let changeRate = 0;
			changeRate = currentCount - previousCount;

			// const allRegistration =
			// 	await this.prismaService.tournamentRegistration.count({
			// 		where: {
			// 			tournament: {
			// 				organizerId,
			// 			},
			//
			// 			status: TournamentRegistrationStatus.APPROVED,
			// 		},
			// 	});

			return {
				currentCount,
				previousCount,
				changeRate: parseFloat(changeRate.toFixed(2)),
			};
		} catch (error) {
			console.error("countNumberOfRegistrationsInCurrentMonth failed", error);
			throw error;
		}
	}
}
