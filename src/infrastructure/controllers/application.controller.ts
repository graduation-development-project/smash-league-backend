import { Body, Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { PrismaClient } from "@prisma/client";
import { ApplicationFunction } from "src/application/usecases/application.function";

@Controller('/application')
export class ApplicationController {
	constructor(private applicationFunction: ApplicationFunction,
	) {
	}
	@Get('api-version')
	getVersioningAPI() {
		return this.applicationFunction.getApiVersion();
	}

	@Post("/create-json-data")
	@UseInterceptors(AnyFilesInterceptor())
	async createJsonData(@Body() data: any): Promise<any> {
		console.log(JSON.parse(data.data));
	}
}