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
import { ReportStatus, ReportType } from "@prisma/client";

@Injectable()
export class ReportPlayerUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
		@Inject("TransactionRepository")
		private readonly transactionRepository: TransactionRepositoryPort,
		@Inject("ReportRepository")
		private readonly reportRepository: ReportRepositoryPort,
		private readonly payosPaymentService: PaymentPayOSService,
	) {}

	async execute(createReport: ICreateReport): Promise<ApiResponse<any>> {
		const report = await this.reportRepository.createReport({
			...createReport,
			type: ReportType.ATHLETE,
			status: ReportStatus.WAITING_PAYING_FEE,
		});

		const tournament = await this.tournamentRepository.getTournament(
			createReport.tournamentId,
		);

		const transaction =
			await this.transactionRepository.createTransactionForReportFee({
				userId: createReport.userId,
				transactionDetail: "Payment for report fee",
				value: tournament.protestFeePerTime,
				reportId: report.id,
			});

		const payment =
			await this.payosPaymentService.createPaymentLinkForReportFee(
				transaction.id,
				tournament.protestFeePerTime,
			);
		console.log(payment);

		const updateTransaction =
			await this.transactionRepository.updatePaymentForTransaction(
				transaction.id,
				payment.paymentImagePaymentLinkResponse,
				payment.checkoutDataResponse.checkoutUrl,
			);
		return new ApiResponse<any>(
			HttpStatus.OK,
			"Report player successful!",
			payment,
		);
	}
}
