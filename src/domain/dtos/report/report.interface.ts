import { ReportStatus } from "@prisma/client";

export class ICreateReport {
	tournamentId: string;
	userId: string;
	reason: string;
	status: ReportStatus;
	createdAt: Date;
	updatedAt: Date;
}

export class IReportResponse {
	id: string;
	user: string;
	tournament: string;
	status: string;
	createdAt: Date;
}