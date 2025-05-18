import { Injectable } from "@nestjs/common";
import {
	PrismaClient,
	ReportStatus,
	ReportType,
	UserReport,
} from "@prisma/client";
import { create } from "domain";
import { report } from "process";
import {
	ICreateReport,
	IReportResponse,
} from "src/domain/dtos/report/report.interface";
import { ReportRepositoryPort } from "src/domain/repositories/report.repository.port";

@Injectable()
export class PrismaReportRepositoryAdapter implements ReportRepositoryPort {
	constructor(private readonly prisma: PrismaClient) {}

	async getAllReport(): Promise<IReportResponse[]> {
		return await this.prisma.userReport.findMany({
			select: {
				id: true,
				reason: true,
				status: true,
				tournament: true,
				user: true,
				createdAt: true,
			},
		});
	}

	async getAllReportFromUser(userId: string): Promise<IReportResponse[]> {
		console.log(userId);
		return await this.prisma.userReport.findMany({
			where: {
				userId: userId,
			},
			select: {
				id: true,
				reason: true,
				status: true,
				tournament: true,
				user: true,
				createdAt: true,
			},
		});
	}

	async getAllReportOfTournament(
		tournamentId: string,
	): Promise<IReportResponse[]> {
		return await this.prisma.userReport.findMany({
			where: {
				tournamentId: tournamentId,
			},
			select: {
				id: true,
				reason: true,
				status: true,
				tournament: true,
				user: true,
				createdAt: true,
			},
		});
	}

	async createReport(createReport: ICreateReport): Promise<UserReport> {
		return await this.prisma.userReport.create({
			data: {
				...createReport,
			},
		});
	}

	async approveReport(reportId: string): Promise<UserReport> {
		return await this.prisma.userReport.update({
			where: {
				id: reportId,
			},
			data: {
				status: ReportStatus.HANDLED,
			},
		});
	}

	async rejectReport(reportId: string): Promise<UserReport> {
		return await this.prisma.userReport.update({
			where: {
				id: reportId,
			},
			data: {
				status: ReportStatus.REJECTED,
			},
		});
	}

	async updateReportStatus(reportId: string): Promise<UserReport> {
		return this.prisma.userReport.update({
			where: {
				id: reportId,
			},
			data: {
				status: ReportStatus.PENDING,
			},
		});
	}

	async getReportByUserId(userId: string): Promise<UserReport[]> {
		return this.prisma.userReport.findMany({
			where: {
				userId,
			},

			include: {
				reportUser: {
					select: {
						id: true,
						name: true,
					},
				},

				tournament: {
					select: {
						id: true,
						name: true,
					},
				},

				tournamentEvent: {
					select: {
						id: true,
						tournamentEvent: true,
					},
				},
			},
		});
	}

	async getReportDetails(reportId: string): Promise<UserReport> {
		return this.prisma.userReport.findUnique({
			where: {
				id: reportId,
			},

			include: {
				reportUser: true,
				user: true,
				tournament: true,
				tournamentEvent: true,
			},
		});
	}
}
