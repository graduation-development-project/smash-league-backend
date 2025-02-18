import { Controller, Get, HttpCode, HttpStatus, Inject, Res, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "../guards/auth/local.guard";
import { GetPackagesUseCase } from "src/application/usecases/packages/get-packages.usecase";
import { ApiResponse } from "src/domain/dtos/api-response";
import { PackageEntity } from "src/domain/entities/transaction/package.entity";
import { HTTPStatusCodeEnum } from "../enums/http-status-code.enum";

@Controller("/package")
export class PackageController {
	constructor(
		private getPackages: GetPackagesUseCase
	) {
	}


	@Get("/get-all")
	@HttpCode(HTTPStatusCodeEnum.OK)
	async getPackage() : Promise<ApiResponse<PackageEntity[]>> {
		return await this.getPackages.execute();
	}
}