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

@Controller("/staffs")
@UseGuards(JwtAccessTokenGuard, RolesGuard)
@Roles(RoleMap.Staff.id)
export class StaffController {
	constructor(
		private verifyUserInformationUseCase: VerifyUserInformationUseCase,
	) {}

	@Put("/verify-information")
	verifyInformation(
		@Body()
		body: {
			verificationID: string;
			option: boolean;
			rejectionReason?: string;
		},
	): Promise<string> {
		return this.verifyUserInformationUseCase.execute(
			body.verificationID,
			body.option,
			body.rejectionReason,
		);
	}
}
