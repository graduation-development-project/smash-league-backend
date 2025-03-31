import { HttpStatus, Inject } from "@nestjs/common";
import { Package } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ICreatePackage } from "src/domain/interfaces/package/package.interface";
import { PackageRepositoryPort } from "src/domain/interfaces/repositories/package.repository.port";

export class CreatePackageUseCase {
	constructor(
		@Inject("PackageRepository") private readonly packageRepository: PackageRepositoryPort
	){
	}

	async execute(createPackage: ICreatePackage) : Promise<ApiResponse<Package>> {
		return new ApiResponse<Package>(
			HttpStatus.OK,
			"Create new package successfully!",
			await this.packageRepository.createPackage(createPackage)
		);
	}
}