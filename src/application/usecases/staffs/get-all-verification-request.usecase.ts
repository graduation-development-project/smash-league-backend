import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { StaffsRepositoryPort } from "../../../domain/repositories/staffs.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { UserVerification } from "@prisma/client";

@Injectable()
export class GetAllVerificationRequestUseCase {
	constructor(
		@Inject("StaffRepository") private staffRepository: StaffsRepositoryPort,
	) {}

	async execute(): Promise<ApiResponse<UserVerification[]>> {
		return new ApiResponse<UserVerification[]>(
			HttpStatus.OK,
			"Get all verification request successfully",
			await this.staffRepository.getAllVerificationRequest(),
		);
	}
}
