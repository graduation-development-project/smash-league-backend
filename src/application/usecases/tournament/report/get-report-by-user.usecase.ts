import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IReportResponse } from "src/domain/dtos/report/report.interface";
import { ReportRepositoryPort } from "src/domain/repositories/report.repository.port";
import { UsersRepositoryPort } from "src/domain/repositories/users.repository.port";
import { UserReport } from "@prisma/client";

@Injectable()
export class GetReportByUserUseCase {
	constructor(
		@Inject("ReportRepository")
		private readonly reportRepository: ReportRepositoryPort,
	) {}

	async execute(userId: string): Promise<ApiResponse<UserReport[]>> {
		const reports = await this.reportRepository.getReportByUserId(userId);
		if (reports.length === 0)
			return new ApiResponse<null | undefined>(
				HttpStatus.NOT_FOUND,
				"No reports found!",
				null,
			);
		return new ApiResponse<UserReport[]>(
			HttpStatus.OK,
			"Get all reports success!",
			reports,
		);
	}
}
