import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { PaybackFeeList, UserVerification } from "@prisma/client";
import { PaybackFeeListRepositoryPort } from "../../../domain/repositories/payback-fee-list.repository.port";

@Injectable()
export class GetAllPaybackFeeListUseCase {
	constructor(
		@Inject("PaybackFeeListRepositoryPort")
		private paybackFeeListRepository: PaybackFeeListRepositoryPort,	) {}

	async execute(): Promise<ApiResponse<PaybackFeeList[]>> {
		return new ApiResponse<PaybackFeeList[]>(
			HttpStatus.OK,
			"Get payback fee list successfully",
			await this.paybackFeeListRepository.getPaybackFeeList(),
		);
	}
}
