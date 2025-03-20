import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CheckoutResponseDataType } from "@payos/node/lib/type";
import { IPayOSPaymentResponse } from "src/domain/interfaces/payment/payos.payment.interface";

const PayOS = require("@payos/node");

@Injectable()
export class PaymentPayOSService {

	constructor(
		private configService: ConfigService
	) {
	}
	async createPaymentLink(orderId: string) : Promise<IPayOSPaymentResponse> {
		try {
			const payOS = new PayOS(
				this.configService.get<string>("PAYOS_CLIENT_ID"),
				this.configService.get<string>("PAYOS_API_KEY"),
				this.configService.get<string>("PAYOS_CHECKSUM_KEY")
			);
			const body = {
				orderCode: 8567565,
				amount: 2000,
				description: "Thanh toan don hang",
				items: [
					{
						name: "Mi tom hao hao",
						quantity: 1,
						price: 2000
					},
				],
				cancelUrl: this.configService.get<string>("PAYOS_CANCEL_URL"),
				returnUrl: this.configService.get<string>("PAYOS_RETURN_URL"),
			};
			return await payOS.createPaymentLink(body);
		} catch (ex) {
			return ex;
		}
	}
}