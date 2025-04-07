import { HttpStatus, Inject } from "@nestjs/common";
import {
	TournamentRegistrationStatus,
	Transaction,
	TransactionType,
} from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IRequestUser } from "src/domain/interfaces/interfaces";
import { OrderRepositoryPort } from "src/domain/repositories/order.repository.port";
import { PackageRepositoryPort } from "src/domain/repositories/package.repository.port";
import { TransactionRepositoryPort } from "src/domain/repositories/transaction.repository.port";
import { UsersRepositoryPort } from "src/domain/repositories/users.repository.port";
import { TournamentRegistrationRepositoryPort } from "../../../domain/repositories/tournament-registration.repository.port";

export class RejectPaymentUseCase {
	constructor(
		@Inject("OrderRepository")
		private readonly orderRepository: OrderRepositoryPort,
		@Inject("UserRepository")
		private readonly userRepository: UsersRepositoryPort,
		@Inject("TransactionRepository")
		private readonly transactionRepository: TransactionRepositoryPort,
		@Inject("PackageRepository")
		private readonly packageRepository: PackageRepositoryPort,
		@Inject("TournamentRegistrationRepositoryPort")
		private readonly tournamentRegistrationRepository: TournamentRegistrationRepositoryPort,
	) {}

	async execute(
		user: IRequestUser,
		transactionId: number,
	): Promise<ApiResponse<null>> {
		const transaction =
			await this.transactionRepository.getTransaction(transactionId);
		if (transaction.status === "FAILED" || transaction.status === "SUCCESSFUL")
			return new ApiResponse<null | undefined>(
				HttpStatus.BAD_REQUEST,
				"Cannot use this function!",
				null,
			);

		await this.transactionRepository.rejectTransaction(transactionId);

		if (transaction.transactionType === TransactionType.BUYING_PAKCKAGE) {
			// await this.orderRepository.cancelOrder(transaction.orderId);
		}

		if (transaction.transactionType === TransactionType.PAY_REGISTRATION_FEE) {
			await this.tournamentRegistrationRepository.updateStatus(
				transaction.tournamentRegistrationId,
				TournamentRegistrationStatus.REJECTED,
			);
		}

		return new ApiResponse<null | undefined>(
			HttpStatus.OK,
			"Reject payment successful!",
			null,
		);
	}
}
