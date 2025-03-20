import { Controller, Get, Param } from "@nestjs/common";
import { CheckoutResponseDataType } from "@payos/node/lib/type";
import { CreatePaymentLinkUseCase } from "src/application/usecases/payment/create-payment-link.usecase";
import { ApiResponse } from "src/domain/dtos/api-response";
import * as QRCode from 'qrcode';
import { IPayOSPaymentResponse } from "src/domain/interfaces/payment/payos.payment.interface";

@Controller("/payment")
export class PaymentController {
	constructor(
		private createPaymentLinkUseCase: CreatePaymentLinkUseCase
	) {}
	
	@Get("/buy-package/:packageId")
	async createPaymentLink(@Param("packageId") packageId: string) : Promise<ApiResponse<IPayOSPaymentResponse>> {
		return await this.createPaymentLinkUseCase.execute(packageId);
	}

	@Get("/generate-qr-code")
	async generateQrCode() : Promise<any> {
		return await QRCode.toDataURL("00020101021238570010A000000727012700069704220113VQRQABSEF60540208QRIBFTTA5303704540420005802VN62230819Thanh toan don hang63048AE7");
	}
}