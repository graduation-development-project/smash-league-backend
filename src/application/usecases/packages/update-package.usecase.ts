import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Package } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { UpdatePackageDTO } from "src/domain/interfaces/package/package.validation";
import { PackageRepositoryPort } from "src/domain/repositories/package.repository.port";

@Injectable()
export class UpdatePackageUseCase {
	constructor(
		@Inject("PackageRepository")
		private readonly packageRepository: PackageRepositoryPort
	) {
	}

	async execute(updatePackage: UpdatePackageDTO): Promise<ApiResponse<Package>> {
		const packageDetail = await this.packageRepository.getPackageDetail(updatePackage.id);
		if (packageDetail === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Package not found!",
			null
		);
		return new ApiResponse<Package>(
			HttpStatus.NO_CONTENT,
			"Update package success!",
			await this.packageRepository.modifyPackage(updatePackage)
		);
	}
}