import { HttpStatus, Inject } from "@nestjs/common";
import { UserReport } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ReportRepositoryPort } from "src/domain/repositories/report.repository.port";

export class RejectReportUseCase {
	constructor(
		@Inject("ReportRepository")
		private readonly reportRepository: ReportRepositoryPort
	) {
	}

	async execute(reportId: string): Promise<ApiResponse<UserReport>> {
		try {
			return new ApiResponse<UserReport>(
				HttpStatus.NO_CONTENT,
				"Reject report success!",
				await this.reportRepository.rejectReport(reportId)
			);
		} catch (e) {
			return new ApiResponse<null | undefined>(
				HttpStatus.BAD_REQUEST,
				"No report found!",
				null
			);
		}
	}
}