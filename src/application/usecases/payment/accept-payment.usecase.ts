import { IRequestUser } from './../../../domain/interfaces/interfaces';
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Transaction } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { OrderRepositoryPort } from "src/domain/repositories/order.repository.port";
import { PackageRepositoryPort } from "src/domain/repositories/package.repository.port";
import { TransactionRepositoryPort } from "src/domain/repositories/transaction.repository.port";
import { UsersRepositoryPort } from "src/domain/repositories/users.repository.port";

@Injectable()
export class AcceptPaymentUseCase {
	constructor(
		@Inject("PackageRepository")
		private readonly packageRepository: PackageRepositoryPort,
		@Inject("OrderRepository")
		private readonly orderRepository: OrderRepositoryPort,
		@Inject("UserRepository")
		private readonly userRepository: UsersRepositoryPort,
		@Inject("TransactionRepository")
		private readonly transactionRepository: TransactionRepositoryPort
	) {
	}

	async execute(user: IRequestUser, transactionId: string): Promise<ApiResponse<Transaction>> {
		const transaction = await this.transactionRepository.getTransaction(transactionId);
		if (transaction.status === "SUCCESSFUL") return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Cannot accept transaction 2 times or more!",
			null
		);
		const order = await this.orderRepository.getOrder(transaction.orderId);
		const packageDetail = await this.packageRepository.getPackageDetail(order.package.id);
		const creditRemains = await this.userRepository.addCreditForUser(user.user.id, packageDetail.credits);
		const updateTransaction = await this.transactionRepository.acceptTransaction(transactionId);
		console.log(updateTransaction);		
		return new ApiResponse<Transaction>(
			HttpStatus.OK,
			"Accept payment successful!",
			creditRemains
		);
	}
}