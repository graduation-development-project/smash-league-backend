import { Controller, Get } from "@nestjs/common";
import { CheckoutResponseDataType } from "@payos/node/lib/type";
import { CreatePaymentLinkUseCase } from "src/application/usecases/payment/create-payment-link.usecase";
import { ApiResponse } from "src/domain/dtos/api-response";

@Controller("/payment")
export class PaymentController {
	constructor(
		private createPaymentLinkUseCase: CreatePaymentLinkUseCase
	) {}
	
	@Get("create-payment-link")
	async createPaymentLink() : Promise<ApiResponse<CheckoutResponseDataType>> {
		return await this.createPaymentLinkUseCase.execute();
	}
}