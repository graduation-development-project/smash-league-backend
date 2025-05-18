import {
	BadRequestException,
	HttpStatus,
	Inject,
	Injectable,
} from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ICreateOrderRequest } from "src/domain/interfaces/payment/order.payment.interface";
import { OrderRepositoryPort } from "src/domain/repositories/order.repository.port";
import { PackageRepositoryPort } from "src/domain/repositories/package.repository.port";
import { TransactionRepositoryPort } from "src/domain/repositories/transaction.repository.port";
import { PaymentPayOSService } from "src/application/services/payment.service";
import { PrismaService } from "../../../infrastructure/services/prisma.service";
import {
	TournamentRegistration,
	TournamentRegistrationStatus,
	Transaction,
} from "@prisma/client";
import { UploadService } from "../../../infrastructure/services/upload.service";
import { ICreatePaybackTransactionRequest } from "../../../domain/interfaces/payment/transaction.interface";
import { CreatePaybackTransactionDTO } from "../../../domain/dtos/transactions/create-payback-transaction.dto";
import { NotificationsRepositoryPort } from "../../../domain/repositories/notifications.repository.port";
import { CreateNotificationDTO } from "../../../domain/dtos/notifications/create-notification.dto";
import { NotificationTypeMap } from "../../../infrastructure/enums/notification-type.enum";
import { TournamentRegistrationRepositoryPort } from "../../../domain/repositories/tournament-registration.repository.port";
import { PaybackFeeRepositoryPort } from "../../../domain/repositories/payback-fee-list.repository.port";
import { ReportRepositoryPort } from "../../../domain/repositories/report.repository.port";
import { TournamentRepositoryPort } from "../../../domain/repositories/tournament.repository.port";

@Injectable()
export class PayReportFeeUseCase {
	constructor(
		@Inject("TransactionRepository")
		private readonly transactionRepository: TransactionRepositoryPort,
		@Inject("ReportRepository")
		private readonly reportRepository: ReportRepositoryPort,
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
		private readonly payosPaymentService: PaymentPayOSService,
	) {}

	async execute(reportId: string): Promise<ApiResponse<any>> {
		const reportExisted =
			await this.reportRepository.getReportDetails(reportId);

		if (!reportExisted) {
			throw new BadRequestException("Report not existed");
		}

		const tournament = await this.tournamentRepository.getTournament(
			reportExisted.tournamentId,
		);

		const transaction =
			await this.transactionRepository.createTransactionForReportFee({
				userId: reportExisted.userId,
				transactionDetail: "Payment for report fee",
				value: tournament.protestFeePerTime,
				reportId: reportExisted.id,
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
			HttpStatus.CREATED,
			"Pay report fee successfully!!",
			payment,
		);
	}
}
