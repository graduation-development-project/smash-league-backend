import { HttpStatus, Inject } from "@nestjs/common";
import { Transaction } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IRequestUser } from "src/domain/interfaces/interfaces";
import { OrderRepositoryPort } from "src/domain/repositories/order.repository.port";
import { PackageRepositoryPort } from "src/domain/repositories/package.repository.port";
import { TransactionRepositoryPort } from "src/domain/repositories/transaction.repository.port";
import { UsersRepositoryPort } from "src/domain/repositories/users.repository.port";

export class RejectPaymentUseCase {
	constructor(
		@Inject("OrderRepository")
		private readonly orderRepository: OrderRepositoryPort,
		@Inject("UserRepository")
		private readonly userRepository: UsersRepositoryPort,
		@Inject("TransactionRepository")
		private readonly transactionRepository: TransactionRepositoryPort,
		@Inject("PackageRepository")
		private readonly packageRepository: PackageRepositoryPort
	) {
	}

	async execute(user: IRequestUser, transactionId: string) : Promise<ApiResponse<null>> {
		const transaction = await this.transactionRepository.getTransaction(transactionId);
		if (transaction.status === "FAILED" || transaction.status === "SUCCESSFUL") return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Cannot use this function!",
			null
		);
		const updateTransaction = await this.transactionRepository.rejectTransaction(transactionId);
		const updateOrder = await this.orderRepository.acceptOrder(transaction.orderId);
		return new ApiResponse<null | undefined>(
			HttpStatus.OK,
			"Reject payment successful!",
			null
		);
	}
}