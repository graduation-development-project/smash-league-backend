import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { StaffsRepositoryPort } from "../../../domain/interfaces/repositories/staffs.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";

@Injectable()
export class VerifyUserInformationUseCase {
	constructor(
		@Inject("StaffRepository") private staffRepository: StaffsRepositoryPort,
	) {}

	async execute(
		verificationID: string,
		option: boolean,
		rejectionReason?: string,
	): Promise<ApiResponse<null>> {
		return new ApiResponse<null>(
			HttpStatus.NO_CONTENT,
			await this.staffRepository.verifyUserInformation(
				verificationID,
				option,
				rejectionReason,
			),
			null,
		);
	}
}
