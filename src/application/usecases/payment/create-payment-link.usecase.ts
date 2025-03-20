import { Injectable } from "@nestjs/common";
import { CheckoutResponseDataType } from "@payos/node/lib/type";
import { PaymentPayOSService } from "src/application/services/payment.service";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IPayOSPaymentResponse } from "src/domain/interfaces/payment/payos.payment.interface";

@Injectable()
export class CreatePaymentLinkUseCase {
	constructor(
		private readonly paymentPayOsService: PaymentPayOSService
	) {
	}

	async execute() : Promise<ApiResponse<IPayOSPaymentResponse>> {
		// try {
		// 	const order = await this.paymentPayOsService.createPaymentLink();
		// 	return new ApiResponse<IPayOSPaymentResponse>(
		// 		200,
		// 		"Create payment link successful!",
		// 		order
		// 	);
		// } catch(ex) {
		// 	return ex;
		// }
		return;
	}	
}