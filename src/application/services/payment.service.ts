import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CheckoutResponseDataType } from "@payos/node/lib/type";

const PayOS = require("@payos/node");

@Injectable()
export class PaymentPayOSService {

	constructor(
		private readonly configService: ConfigService
	) {

	}
	async createPaymentLink() : Promise<CheckoutResponseDataType> {
		const payOS = new PayOS(
			"699488c9-2d90-4c3a-afdb-95cf093e406f",
			"03234458-982c-47a9-b4f2-c33486623104",
			"4ccaccfbf838d2507755aa2f976454fbb68ef6d069ff512ab44aec3409e63dcf"
		);
		const body = {
			orderCode: 5345345,
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