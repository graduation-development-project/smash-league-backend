import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ICreateOrderRequest } from "src/domain/interfaces/payment/order.payment.interface";
import { OrderRepositoryPort } from "src/domain/repositories/order.repository.port";
import { PackageRepositoryPort } from "src/domain/repositories/package.repository.port";
import { TransactionRepositoryPort } from "src/domain/repositories/transaction.repository.port";
import { PaymentPayOSService } from "src/application/services/payment.service";
import { ICreateTransactionRequest } from "../../../domain/interfaces/payment/transaction.interface";
import { ICreateReport } from "../../../domain/dtos/report/report.interface";
import { TournamentRepositoryPort } from "../../../domain/repositories/tournament.repository.port";
import { ReportRepositoryPort } from "../../../domain/repositories/report.repository.port";
import { ReportStatus, ReportType, UserReport } from "@prisma/client";

@Injectable()
export class ReportPlayerUseCase {
	constructor(
		@Inject("ReportRepository")
		private readonly reportRepository: ReportRepositoryPort,
	) {}

	async execute(createReport: ICreateReport): Promise<ApiResponse<UserReport>> {
		const report = await this.reportRepository.createReport({
			...createReport,
			type: ReportType.ATHLETE,
			status: ReportStatus.WAITING_PAYING_FEE,
		});

		return new ApiResponse<UserReport>(
			HttpStatus.OK,
			"Report player successful!",
			report,
		);
	}
}
