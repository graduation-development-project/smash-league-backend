import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IReportResponse } from "src/domain/dtos/report/report.interface";
import { ReportRepositoryPort } from "src/domain/repositories/report.repository.port";
import { UsersRepositoryPort } from "src/domain/repositories/users.repository.port";

@Injectable()
export class GetAllReportOfUserUseCase {
	constructor(
		@Inject("UserRepository")
		private readonly userRepository: UsersRepositoryPort,
		@Inject("ReportRepository")
		private readonly reportRepository: ReportRepositoryPort
	) {
	}

	async execute(userId: string): Promise<ApiResponse<IReportResponse[]>> {
		const user = await this.userRepository.getUser(userId);
		if (user === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"User not found!",
			null
		);
		var reports: IReportResponse[] = await this.reportRepository.getAllReportFromUser(userId);
		if (reports.length === 0) return new ApiResponse<null | undefined>(
			HttpStatus.NOT_FOUND,
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