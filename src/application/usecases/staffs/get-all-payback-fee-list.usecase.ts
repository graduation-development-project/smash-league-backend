import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { PaybackFee, UserVerification } from "@prisma/client";
import { PaybackFeeRepositoryPort } from "../../../domain/repositories/payback-fee-list.repository.port";

@Injectable()
export class GetAllPaybackFeeListUseCase {
	constructor(
		@Inject("PaybackFeeRepositoryPort")
		private paybackFeeRepository: PaybackFeeRepositoryPort,	) {}

	async execute(): Promise<ApiResponse<PaybackFee[]>> {
		return new ApiResponse<PaybackFee[]>(
			HttpStatus.OK,
			"Get payback fee list successfully",
			await this.paybackFeeRepository.getPaybackFeeList(),
		);
	}
}
