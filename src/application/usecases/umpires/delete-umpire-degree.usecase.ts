import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { UmpireDegreeRepositoryPort } from "src/domain/repositories/umpire-degree.repository.port";

@Injectable()
export class DeleteUmpireDegreeUseCase {
	constructor(
		@Inject("UmpireDegreeRepository")
		private readonly umpireDegreeRepository: UmpireDegreeRepositoryPort
	) {
	}

	async execute(degreeId: string): Promise<ApiResponse<any>> {
		const umpireDegree = await this.umpireDegreeRepository.getUmpireDegreeById(degreeId);
		if (umpireDegree === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"No umpire degree found!",
			null
		);
		return new ApiResponse<any>(
			HttpStatus.OK,
			"Delete umpire degree success!",
			await this.umpireDegreeRepository.deleteUmpireDegree(degreeId)
		);
	}

}