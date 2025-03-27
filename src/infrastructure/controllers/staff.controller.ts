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
import { UserVerification } from "@prisma/client";
import { GetAllVerificationRequestUseCase } from "../../application/usecases/staffs/get-all-verification-request.usecase";

@Controller("/staffs")
@UseGuards(JwtAccessTokenGuard, RolesGuard)
@Roles(RoleMap.Staff.name)
export class StaffController {
	constructor(
		private verifyUserInformationUseCase: VerifyUserInformationUseCase,
		private getAllVerificationRequestUseCase: GetAllVerificationRequestUseCase,
	) {}

	@Get("/user-verifications")
	getAllVerificationRequest(): Promise<ApiResponse<UserVerification[]>> {
		return this.getAllVerificationRequestUseCase.execute();
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
