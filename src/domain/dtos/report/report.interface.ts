import { ReportStatus, Tournament, User } from "@prisma/client";

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
	user: User;
	tournament: Tournament;
	status: string;
	createdAt: Date;
}