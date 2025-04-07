import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ICreateOrderRequest } from "src/domain/interfaces/payment/order.payment.interface";
import { OrderRepositoryPort } from "src/domain/repositories/order.repository.port";
import { PackageRepositoryPort } from "src/domain/repositories/package.repository.port";
import { TransactionRepositoryPort } from "src/domain/repositories/transaction.repository.port";
import { PaymentPayOSService } from "src/application/services/payment.service";
import { PrismaService } from "../../../infrastructure/services/prisma.service";
import { TournamentRegistrationStatus } from "@prisma/client";

@Injectable()
export class PayRegistrationFeeUseCase {
	constructor(
		@Inject("TransactionRepository")
		private readonly transactionRepository: TransactionRepositoryPort,
		private readonly payosPaymentService: PaymentPayOSService,
		private prismaService: PrismaService,
	) {}

	async execute(tournamentRegistrationId: string): Promise<ApiResponse<any>> {
		const tournamentRegistration =
			await this.prismaService.tournamentRegistration.findUnique({
				where: {
					id: tournamentRegistrationId,
				},

				include: {
					tournamentEvent: true,
					tournament: true,
				},
			});

		let value = tournamentRegistration.tournamentEvent.tournamentEvent.includes(
			"DOUBLE",
		)
			? tournamentRegistration.tournament.registrationFeePerPair
			: tournamentRegistration.tournament.registrationFeePerPerson;

		const transaction =
			await this.transactionRepository.createTransactionForRegistrationFee({
				transactionDetail: "Pay tournament fee",
				tournamentRegistrationId,
				value,
			});

		const payment =
			await this.payosPaymentService.createPaymentLinkForRegistrationFee(
				tournamentRegistration.tournamentEvent,
				transaction.id,
				value,
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
			"Create payment successful!",
			payment,
		);
	}
}
