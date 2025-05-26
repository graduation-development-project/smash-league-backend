import { HttpStatus, Inject } from "@nestjs/common";
import { UmpireDegree } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { UmpireDegreeResponse } from "src/domain/dtos/umpire/umpire-degree.interface";
import { IRequestUser } from "src/domain/interfaces/interfaces";
import { UmpireDegreeRepositoryPort } from "src/domain/repositories/umpire-degree.repository.port";

export class GetPersonalUmpireDegreesUseCase {
	constructor(
		@Inject("UmpireDegreeRepository")
		private readonly umpireDegreeRepository: UmpireDegreeRepositoryPort
	){
	}

	async execute(request: IRequestUser): Promise<ApiResponse<UmpireDegreeResponse[]>> {
		const umpireDegrees = await this.umpireDegreeRepository.getAllDegreeOfUmpire(request.user.id);
		if (umpireDegrees.length === 0) return new ApiResponse<null | undefined>(
			HttpStatus.OK,
			"No umpire degrees found!",
			null
		);
		return new ApiResponse<UmpireDegreeResponse[]>(
			HttpStatus.OK,
			"Get all umpire degrees success!",
			umpireDegrees
		);
	}
}