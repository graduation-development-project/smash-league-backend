import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { UserReport } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ReportRepositoryPort } from "src/domain/repositories/report.repository.port";

@Injectable()
export class ApproveReportUseCase {
	constructor(
		@Inject("ReportRepository")
		private readonly reportRepository: ReportRepositoryPort
	) {
	}

	async execute(reportId: string): Promise<ApiResponse<UserReport>> {
		try {
			return new ApiResponse<UserReport>(
				HttpStatus.NO_CONTENT,
				"Approve report success!",
				await this.reportRepository.approveReport(reportId)
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