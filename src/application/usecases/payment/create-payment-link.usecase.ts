import { Injectable } from "@nestjs/common";
import { CheckoutResponseDataType } from "@payos/node/lib/type";
import { PaymentPayOSService } from "src/application/services/payment.service";
import { ApiResponse } from "src/domain/dtos/api-response";

@Injectable()
export class CreatePaymentLinkUseCase {
	constructor(
		private readonly paymentPayOsService: PaymentPayOSService
	) {
	}

	async execute() : Promise<ApiResponse<any>> {
		return new ApiResponse<CheckoutResponseDataType>(
			200,
			"Create payment link successful!",
			await this.paymentPayOsService.createPaymentLink()
		);
	}
}