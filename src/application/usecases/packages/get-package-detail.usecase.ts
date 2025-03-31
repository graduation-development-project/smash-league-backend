import { HttpStatus, Inject } from "@nestjs/common";
import { Package } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { PackageRepositoryPort } from "src/domain/repositories/package.repository.port";

export class GetPackageDetailUseCase {
	constructor(
		@Inject("PackageRepository") private readonly packageRepository: PackageRepositoryPort
	) {	
	}

	async execute(id: string) : Promise<ApiResponse<Package>> {
		return new ApiResponse<Package>(
			HttpStatus.OK,
			"",
			await this.packageRepository.getPackageDetail(id)
		);
	}
}