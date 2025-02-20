import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CheckoutResponseDataType } from "@payos/node/lib/type";

const PayOS = require("@payos/node");

@Injectable()
export class PaymentPayOSService {

	constructor(
		private configService: ConfigService
	) {

	}
	async createPaymentLink() : Promise<CheckoutResponseDataType> {
		console.log("client: ", this.configService.get<string>("PAYOS_CLIENT_ID"));
		console.log("api: ", this.configService.get<string>("PAYOS_API_KEY"));
		console.log("checksum: ", this.configService.get<string>("PAYOS_CHECKSUM_KEY"));
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
					price: 2000,
				},
			],
			cancelUrl: "http://localhost:3000/cancel.html",
			returnUrl: "http://localhost:3000/success.html",
		};
		return await payOS.createPaymentLink(body);
	}
}