import * as QRCode from 'qrcode';
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CheckoutResponseDataType } from "@payos/node/lib/type";
import { Order } from "@prisma/client";
import { IOrderDetailResponse } from "src/domain/interfaces/payment/order.payment.interface";
import { IPayOSPaymentResponse } from "src/domain/interfaces/payment/payos.payment.interface";
const PayOS = require("@payos/node");
@Injectable()
export class PaymentPayOSService {

	constructor(
		private readonly configService: ConfigService
	) {
	}
	async createPaymentLink(order: IOrderDetailResponse) : Promise<IPayOSPaymentResponse> {
			const payOS = new PayOS(
				this.configService.get<string>("PAYOS_CLIENT_ID"),
				this.configService.get<string>("PAYOS_API_KEY"),
				this.configService.get<string>("PAYOS_CHECKSUM_KEY")
			);
			const body = {
				orderCode: order.id,
				amount: order.total,
				description: "Payment for package " + order.package.packageName,
				items: [
					{
						name: "Package " + order.package.packageName,
						quantity: 1,
						price: order.total,
					},
				],
				cancelUrl: "http://localhost:3000/cancel.html",
				returnUrl: "http://localhost:3000/success.html",
			};
			try {
				const data = await payOS.createPaymentLink(body);
				return {
					checkoutDataResponse: data,
					paymentImagePaymentLinkResponse: await QRCode.toDataURL(data.checkoutUrl)
				};
			} catch (ex) {
				console.log(ex);
			}
	}
}