import { create } from 'domain';
import { UserReport } from "@prisma/client";
import { ICreateReport, IReportResponse } from '../dtos/report/report.interface';

export interface ReportRepositoryPort {
	getAllReport(): Promise<IReportResponse[]>;
	getAllReportFromUser(userId: string): Promise<IReportResponse[]>;
	getAllReportOfTournament(tournamentId: string): Promise<IReportResponse[]>;
	createReport(createReport: ICreateReport): Promise<UserReport>;
	approveReport(reportId: string): Promise<UserReport>;
	rejectReport(reportId: string): Promise<UserReport>;
	updateReportStatus(reportId: string): Promise<UserReport>;
	getReportByUserId(userId: string): Promise<UserReport[]>;
}