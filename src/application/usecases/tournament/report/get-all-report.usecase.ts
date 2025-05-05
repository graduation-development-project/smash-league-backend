import { Inject } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ReportRepositoryPort } from "src/domain/repositories/report.repository.port";

export class GetAllReportUseCase {
	constructor(
		@Inject("ReportRepository")
		private readonly reportRepository: ReportRepositoryPort
	) {
	}

	async execute(): Promise<ApiResponse<any>> {
		return;
	}
}