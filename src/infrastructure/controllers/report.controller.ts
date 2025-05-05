import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { CreateReportUseCase } from "src/application/usecases/tournament/report/create-report.usecase";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { CreateReport } from "src/domain/dtos/report/report.validation";
import { UserReport } from "@prisma/client";
import { IRequestUser } from "src/domain/interfaces/interfaces";
import { ApiResponse } from "src/domain/dtos/api-response";
import { GetAllReportUseCase } from "src/application/usecases/tournament/report/get-all-report.usecase";
import { IReportResponse } from "src/domain/dtos/report/report.interface";

@Controller("/report")
export class ReportController {
	constructor(
		private readonly createReportUseCase: CreateReportUseCase,
		private readonly getAllReportUseCase: GetAllReportUseCase
	){
	}

	@Post("/create-new-report")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Athlete.name, RoleMap.Team_Leader.name, RoleMap.Umpire.name)
	async createNewReport(
		@Req() request: IRequestUser,
		@Body() createReport: CreateReport): Promise<ApiResponse<UserReport>> {
		return await this.createReportUseCase.execute(request, createReport);
	}

	@Get("/get-all-reports")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Staff.name)
	async getAllReports(): Promise<ApiResponse<IReportResponse[]>> {
		return await this.getAllReportUseCase.execute()
	}
}