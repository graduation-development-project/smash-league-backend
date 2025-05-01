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

@Injectable()
export class PaybackRegistrationFeeUseCase {
	constructor(
		@Inject("TransactionRepository")
		private readonly transactionRepository: TransactionRepositoryPort,
		@Inject("NotificationRepository")
		private readonly notificationsRepository: NotificationsRepositoryPort,
		@Inject("PaybackFeeRepositoryPort")
		private readonly paybackFeeListRepository: PaybackFeeRepositoryPort,
		private readonly uploadService: UploadService,
	) {}

	async execute(
		createPayback: CreatePaybackTransactionDTO,
	): Promise<ApiResponse<Transaction>> {
		const { paybackImage, transactionDetail, paybackFeeId } = createPayback;

		const paybackFee: any =
			await this.paybackFeeListRepository.getById(paybackFeeId);
		if (!paybackFee) throw new BadRequestException("Payback Fee not found");

		console.log(paybackFee);

		const folderName = `payback-registration-fee/${new Date().toISOString().split("T")[0]}/${paybackFee.userId}}`;

		const imgURLs = await this.uploadService.uploadFiles(
			paybackImage,
			folderName,
			paybackFee.userId,
		);

		console.log("imgURLs", imgURLs);

		if (!imgURLs) {
			throw new BadRequestException("Upload images fail");
		}

		const notificationDTO: CreateNotificationDTO = {
			title: "Your registration fee has been refunded",
			message: `Your registration fee for event ${paybackFee.tournamentEvent.tournamentEvent} of tournament ${paybackFee.tournament.name} has been refunded`,
			type: NotificationTypeMap.Refund.id,
		};

		await this.notificationsRepository.createNotification(notificationDTO, [
			paybackFee.userId,
		]);

		const paybackTransaction =
			await this.transactionRepository.createPaybackTransaction({
				userId: createPayback.userId,
				transactionDetail,
				paybackImage: imgURLs[0].secure_url,
				value: parseInt(paybackFee.value),
				paybackToUserId: paybackFee.userId,
				paybackFeeId,
			});

		if (paybackTransaction) {
			await this.paybackFeeListRepository.updatePaybackStatus(
				paybackFeeId,
				true,
			);
		}

		return new ApiResponse<Transaction>(
			HttpStatus.CREATED,
			"Create payback tournament fee successfully!!",
			paybackTransaction,
		);
	}
}
