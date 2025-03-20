import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { CheckoutResponseDataType } from "@payos/node/lib/type";
import { CreatePaymentLinkUseCase } from "src/application/usecases/payment/create-payment-link.usecase";
import { ApiResponse } from "src/domain/dtos/api-response";
import * as QRCode from 'qrcode';
import { IPayOSPaymentResponse } from "src/domain/interfaces/payment/payos.payment.interface";
import { BuyPackageUseCase } from "src/application/usecases/payment/buy-package.usecase";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/auth/role.guard";
import { RoleMap } from "../enums/role.enum";
import { IRequestUser } from "src/domain/interfaces/interfaces";

@Controller("/payment")
export class PaymentController {
	constructor(
		private createPaymentLinkUseCase: CreatePaymentLinkUseCase,
		private readonly buyPackageUseCase: BuyPackageUseCase
	) {}
	
	@Get("/buy-package/:packageId")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Athlete.name, RoleMap.Organizer.name)
	async buyPackage(
		@Req() request: IRequestUser,
		@Param("packageId") packageId: string) : Promise<ApiResponse<IPayOSPaymentResponse>> {
		return await this.buyPackageUseCase.execute(packageId, request.user.id);
	}

	// @Get("/create-payment-link")
	// async createPaymentLink() {
	// 	return await this.createPaymentLinkUseCase.execute();
	// }

	@Get("/generate-qr-code")
	async generateQrCode() : Promise<any> {
		return await QRCode.toDataURL("00020101021238570010A000000727012700069704220113VQRQABSEF60540208QRIBFTTA5303704540420005802VN62230819Thanh toan don hang63048AE7");
	}
}