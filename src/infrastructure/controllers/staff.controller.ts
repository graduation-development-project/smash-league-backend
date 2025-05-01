import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Put,
	UseGuards,
} from "@nestjs/common";
import { VerifyUserInformationUseCase } from "../../application/usecases/staffs/verify-user-information.usecase";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { ApiResponse } from "../../domain/dtos/api-response";
import { PaybackFee, UserVerification } from "@prisma/client";
import { GetAllVerificationRequestUseCase } from "../../application/usecases/staffs/get-all-verification-request.usecase";
import { GetAllPaybackFeeListUseCase } from "../../application/usecases/staffs/get-all-payback-fee-list.usecase";

@Controller("/staffs")
@UseGuards(JwtAccessTokenGuard, RolesGuard)
@Roles(RoleMap.Staff.name, RoleMap.Admin.name)
export class StaffController {
	constructor(
		private verifyUserInformationUseCase: VerifyUserInformationUseCase,
		private getAllVerificationRequestUseCase: GetAllVerificationRequestUseCase,
		private getAllPaybackFeeListUseCase: GetAllPaybackFeeListUseCase,
	) {}

	@Get("/user-verifications")
	getAllVerificationRequest(): Promise<ApiResponse<UserVerification[]>> {
		return this.getAllVerificationRequestUseCase.execute();
	}

	@Get("/payback-fee-list")
	getPaybackFeeList(): Promise<ApiResponse<PaybackFee[]>> {
		return this.getAllPaybackFeeListUseCase.execute();
	}

	@Put("/verify-information")
	verifyInformation(
		@Body()
		body: {
			verificationID: string;
			option: boolean;
			rejectionReason?: string;
		},
	): Promise<ApiResponse<null>> {
		return this.verifyUserInformationUseCase.execute(
			body.verificationID,
			body.option,
			body.rejectionReason,
		);
	}
}
