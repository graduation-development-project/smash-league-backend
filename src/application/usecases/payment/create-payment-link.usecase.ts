import { Injectable } from "@nestjs/common";
import { CheckoutResponseDataType } from "@payos/node/lib/type";
import { PaymentPayOSService } from "src/infrastructure/services/payment.service";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IPayOSPaymentResponse } from "src/domain/interfaces/payment/payos.payment.interface";

@Injectable()
export class CreatePaymentLinkUseCase {
	constructor(
		private readonly paymentPayOsService: PaymentPayOSService
	) {
	}

	async execute(packageId: string) : Promise<ApiResponse<IPayOSPaymentResponse>> {
		try {
			const order = null;
			return new ApiResponse<IPayOSPaymentResponse>(
				200,
				"Create payment link successful!",
				await this.paymentPayOsService.createPaymentLink("a1asd")
			);
		} catch(ex) {
			return ex;
		}
		
	}
}