import { create } from "domain";
import { IRequestUser } from "./../../../../domain/interfaces/interfaces";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { CreateReport } from "src/domain/dtos/report/report.validation";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";
import { ReportRepositoryPort } from "src/domain/repositories/report.repository.port";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";
import { ReportStatus, ReportType, UserReport } from "@prisma/client";

@Injectable()
export class CreateReportUseCase {
	constructor(
		@Inject("ReportRepository")
		private readonly reportRepository: ReportRepositoryPort,
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
	) {}

	async execute(
		request: IRequestUser,
		createReport: CreateReport,
	): Promise<ApiResponse<any>> {
		const tournament = await this.tournamentRepository.getTournament(
			createReport.tournamentId,
		);
		if (tournament === null)
			return new ApiResponse<null | undefined>(
				HttpStatus.BAD_REQUEST,
				"Tournament not found!",
				null,
			);
		return new ApiResponse<UserReport>(
			HttpStatus.CREATED,
			"Create new report success!",
			await this.reportRepository.createReport({
				...createReport,
				createdAt: new Date(),
				updatedAt: new Date(),
				status: ReportStatus.PENDING,
				userId: request.user.id,
				type: ReportType.TOURNAMENT,
			}),
		);
	}
}
