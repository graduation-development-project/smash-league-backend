import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ICreateOrderRequest } from "src/domain/interfaces/payment/order.payment.interface";
import { OrderRepositoryPort } from "src/domain/repositories/order.repository.port";
import { PackageRepositoryPort } from "src/domain/repositories/package.repository.port";
import { TransactionRepositoryPort } from "src/domain/repositories/transaction.repository.port";
import { PaymentPayOSService } from "src/application/services/payment.service";

@Injectable()
export class BuyPackageUseCase {
	constructor(
		@Inject("OrderRepository")
		private readonly orderRepository: OrderRepositoryPort,
		@Inject("PackageRepository")
		private readonly packageRepository: PackageRepositoryPort,
		@Inject("TransactionRepository")
		private readonly transactionRepository: TransactionRepositoryPort,
		private readonly payosPaymentService: PaymentPayOSService
	) {
	}

	async execute(packageId: string, userId: string) : Promise<ApiResponse<any>> {
		const packageDetail = await this.packageRepository.getPackageDetail(packageId);
		if (packageDetail === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Package not found!",
			null
		);
		const order = await this.orderRepository.createOrder({
			packageId: packageId,
			userId: userId,
			total: packageDetail.price - packageDetail.currentDiscountByAmount
		});
		console.log(order);
		const transaction = await this.transactionRepository.createTransactionForBuyingPackage({
			userId: userId,
			orderId: order.id,
			transactionDetail: "Payment for package " + order.package.packageName,
			value: order.total
		});
		const payment = await this.payosPaymentService.createPaymentLink(order, transaction.id);
		console.log(payment);
		const updateTransaction = await this.transactionRepository.updatePaymentForTransaction(transaction.id, payment.paymentImagePaymentLinkResponse, payment.checkoutDataResponse.checkoutUrl);
		return new ApiResponse<any>(
			HttpStatus.OK,
			"Create payment successful!",
			payment
		);
	}
}