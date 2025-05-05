import { HttpStatus, Inject } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IReportResponse } from "src/domain/dtos/report/report.interface";
import { ReportRepositoryPort } from "src/domain/repositories/report.repository.port";

export class GetAllReportUseCase {
	constructor(
		@Inject("ReportRepository")
		private readonly reportRepository: ReportRepositoryPort
	) {
	}

	async execute(): Promise<ApiResponse<IReportResponse[]>> {
		var reports: IReportResponse[] = await this.reportRepository.getAllReport();
		if (reports.length === 0) return new ApiResponse<null | undefined>(
			HttpStatus.OK,
			"No reports found!",
			null
		);
		return new ApiResponse<IReportResponse[]>(
			HttpStatus.OK,
			"Get all reports success!",
			reports
		);
	}
}