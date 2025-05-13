import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { UmpireDegreeResponse } from "src/domain/dtos/umpire/umpire-degree.interface";
import { UmpireDegreeRepositoryPort } from "src/domain/repositories/umpire-degree.repository.port";

@Injectable()
export class GetAllUmpireDegreesUseCase {
	constructor(
		@Inject("UmpireDegreeRepository")
		private readonly umpireDegreeRepository: UmpireDegreeRepositoryPort
	) {
	}

	async execute(umpireId: string): Promise<ApiResponse<UmpireDegreeResponse[]>> {
		const umpireDegrees = await this.umpireDegreeRepository.getAllDegreeOfUmpire(umpireId);
		if (umpireDegrees.length === 0) return new ApiResponse<null | undefined>(
			HttpStatus.NOT_FOUND,
			"No degrees found!",
			null
		);
		return new ApiResponse<UmpireDegreeResponse[]>(
			HttpStatus.OK,
			"Get all umpire degrees success!",
			umpireDegrees
		);
	}
}