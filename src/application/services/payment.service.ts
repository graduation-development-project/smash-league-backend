import * as QRCode from 'qrcode';
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CheckoutResponseDataType } from "@payos/node/lib/type";
import { Order, Tournament, TournamentEvent, TournamentRegistration } from "@prisma/client";
import { IOrderDetailResponse } from "src/domain/interfaces/payment/order.payment.interface";
import { IPayOSPaymentResponse } from "src/domain/interfaces/payment/payos.payment.interface";
import { TournamentEventRepositoryPort } from 'src/domain/repositories/tournament-event.repository.port';
const PayOS = require("@payos/node");
@Injectable()
export class PaymentPayOSService {

	constructor(
		private readonly configService: ConfigService
	) {
	}

	async createPaymentLinkForRegistrationFee(tournamentRegistration: TournamentRegistration, tournament: Tournament, tournamentEvent: TournamentEvent, transactionId: number): Promise<any> {
		const payOS = new PayOS(
			this.configService.get<string>("PAYOS_CLIENT_ID"),
			this.configService.get<string>("PAYOS_API_KEY"),
			this.configService.get<string>("PAYOS_CHECKSUM_KEY")
		);
		let amount = 0;
		if (tournamentEvent.tournamentEvent === "MENS_DOUBLE" ||
			tournamentEvent.tournamentEvent === "WOMENS_DOUBLE" ||
			tournamentEvent.tournamentEvent === "MIXED_DOUBLE") {
				if (tournament.registrationFeePerPair > 0) amount = tournament.registrationFeePerPair;
				else amount = tournament.registrationFeePerPerson * 2;
			} else amount = tournament.registrationFeePerPerson;
		const body = {
			orderCode: transactionId,
			amount: amount,
			description: "Payment for registration fee!",
			items: [
				{
					name: "Payment for " + tournamentEvent.tournamentEvent,
					quantity: 1,
					price: amount,
				},
			],
			cancelUrl: this.configService.get<string>("PAYOS_CANCEL_URL") + "?transactionId=" + transactionId,
			returnUrl: this.configService.get<string>("PAYOS_RETURN_URL") + "?transactionId=" + transactionId,
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
		return;
	}
	async createPaymentLink(order: IOrderDetailResponse, transactionId: number) : Promise<IPayOSPaymentResponse> {
			const payOS = new PayOS(
				this.configService.get<string>("PAYOS_CLIENT_ID"),
				this.configService.get<string>("PAYOS_API_KEY"),
				this.configService.get<string>("PAYOS_CHECKSUM_KEY")
			);
			const body = {
				orderCode: transactionId,
				amount: order.total,
				description: "Payment " + order.package.packageName,
				items: [
					{
						name: "Package " + order.package.packageName,
						quantity: 1,
						price: order.total,
					},
				],
				cancelUrl: this.configService.get<string>("PAYOS_CANCEL_URL") + "?transactionId=" + transactionId,
				returnUrl: this.configService.get<string>("PAYOS_RETURN_URL") + "?transactionId=" + transactionId,
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