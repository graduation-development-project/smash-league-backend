import { Injectable } from "@nestjs/common";
import { PrismaClient, ReportStatus, UserReport } from "@prisma/client";
import { create } from "domain";
import { report } from "process";
import { ICreateReport } from "src/domain/dtos/report/report.interface";
import { ReportRepositoryPort } from "src/domain/repositories/report.repository.port";

@Injectable()
export class PrismaReportRepositoryAdapter implements ReportRepositoryPort {
	constructor(
		private readonly prisma: PrismaClient
	) {
	}
	async getAllReport(): Promise<UserReport[]> {
		return await this.prisma.userReport.findMany();
	}
	async getAllReportFromUser(userId: string): Promise<UserReport[]> {
		return await this.prisma.userReport.findMany({
			where: {
				userId: userId
			}
		});
	}
	async getAllReportOfTournament(tournamentId: string): Promise<UserReport[]> {
		return await this.prisma.userReport.findMany({
			where: {
				tournamentId: tournamentId
			}
		}); 
	}
	async createReport(createReport: ICreateReport): Promise<UserReport> {
		return await this.prisma.userReport.create({
			data: {
				...createReport
			}
		});
	}
	async approveReport(reportId: string): Promise<UserReport> {
		return await this.prisma.userReport.update({
			where: {
				id: reportId
			},
			data: {
				status: ReportStatus.HANDLED
			}
		});
	}
	async rejectReport(reportId: string): Promise<UserReport> {
		return await this.prisma.userReport.update({
			where: {
				id: reportId
			},
			data: {
				status: ReportStatus.REJECTED
			}
		});
	}


}