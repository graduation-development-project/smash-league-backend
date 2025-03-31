import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { PackageEntity } from "src/domain/entities/transaction/package.entity";
import { PackageRepositoryPort } from "src/domain/interfaces/repositories/package.repository.port";

@Injectable()
export class GetPackagesUseCase {
	constructor (
		@Inject("PackageRepository") private packageRepository: PackageRepositoryPort 
	) {
	}

	async execute(): Promise<ApiResponse<PackageEntity[]>> {
		const packages: PackageEntity[] | null = await this.packageRepository.getPackages();
		if (packages.length > 0) {
			return new ApiResponse<PackageEntity[]>(
				HttpStatus.OK,
				"Get packages successfully!",
				await this.packageRepository.getPackages()
			);
		} else return new ApiResponse<null>(
			HttpStatus.NOT_FOUND,
			"",
			null
		);
	}
}