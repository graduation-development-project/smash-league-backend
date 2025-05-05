import { HttpStatus, Inject } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IReportResponse } from "src/domain/dtos/report/report.interface";
import { ReportRepositoryPort } from "src/domain/repositories/report.repository.port";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";

export class GetAllReportOfTournamentUseCase {
	constructor(
		@Inject("ReportRepository")
		private readonly reportRepository: ReportRepositoryPort,
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort
	) {
	}

	async execute(tournamentId: string): Promise<ApiResponse<IReportResponse[]>> {
		const tournament = await this.tournamentRepository.getTournament(tournamentId);
		if (tournament === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Tournament not found!",
			null
		);
		var reports = await this.reportRepository.getAllReportOfTournament(tournamentId);
		if (reports.length === 0) return new ApiResponse<null | undefined>(
			HttpStatus.NOT_FOUND,
			"No reports found!",
			null
		);
		return new ApiResponse<IReportResponse[]>(
			HttpStatus.OK,
			"Get all reports of tournament success!",
			reports
		);
	}
}
