import { create } from 'domain';
import { UserReport } from "@prisma/client";
import { ICreateReport } from '../dtos/report/report.interface';

export interface ReportRepositoryPort {
	getAllReport(): Promise<UserReport[]>;
	getAllReportFromUser(userId: string): Promise<UserReport[]>;
	getAllReportOfTournament(tournamentId: string): Promise<UserReport[]>;
	createReport(createReport: ICreateReport): Promise<UserReport>;
	approveReport(reportId: string): Promise<UserReport>;
	rejectReport(reportId: string): Promise<UserReport>;
}