import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Res, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "../guards/auth/local.guard";
import { GetPackagesUseCase } from "src/application/usecases/packages/get-packages.usecase";
import { ApiResponse } from "src/domain/dtos/api-response";
import { PackageEntity } from "src/domain/entities/transaction/package.entity";
import { HTTPStatusCodeEnum } from "../enums/http-status-code.enum";
import { Package } from "@prisma/client";
import { GetPackageDetailUseCase } from "src/application/usecases/packages/get-package-detail.usecase";
import { ICreatePackage } from "src/domain/interfaces/package/package.interface";
import { CreatePackageUseCase } from "src/application/usecases/packages/create-package.usecase";
import { CreatePackageDto } from "src/domain/dtos/packages/package.dto";
import { create } from "domain";
import { InactivatePackageUseCase } from "src/application/usecases/packages/inactivate-package.usecase";

@Controller("/package")
export class PackageController {
	constructor(
		private getPackages: GetPackagesUseCase,
		private getPackageDetailUseCase: GetPackageDetailUseCase,
		private readonly createPackageUseCase: CreatePackageUseCase,
		private readonly inactivatePackageUseCase: InactivatePackageUseCase
	) {
	}


	@Get("/get-all")
	@HttpCode(HTTPStatusCodeEnum.OK)
	async getPackage() : Promise<ApiResponse<PackageEntity[]>> {
		return await this.getPackages.execute();
	}

	@Get("/get-by-id/:id")
	@HttpCode(HttpStatus.OK)
	async getPackageDetail(@Param("id") id: string) : Promise<any> {
		return await this.getPackageDetailUseCase.execute(id);
	}

	@Post("/create-package")
	@HttpCode(HttpStatus.CREATED)
	@HttpCode(HttpStatus.BAD_REQUEST)
	async createPackage(@Body() createPackage: CreatePackageDto) : Promise<ApiResponse<Package>> {
		return await this.createPackageUseCase.execute({
			...createPackage
		});
	}

	@Get("inactivate-package/:id")
	@HttpCode(HttpStatus.OK)
	@HttpCode(HttpStatus.BAD_REQUEST)
	async inactivatePackage(@Param("id") id: string) : Promise<ApiResponse<Package>> {
		return await this.inactivatePackageUseCase.execute(id);
	}
}