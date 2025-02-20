import { Body, Controller, Get, Put } from "@nestjs/common";
import { VerifyUserInformationUseCase } from "../../application/usecases/staffs/verify-user-information.usecase";

@Controller("/staffs")
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
