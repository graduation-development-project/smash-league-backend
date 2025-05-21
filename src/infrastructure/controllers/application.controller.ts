import { Body, Controller, Get, Post } from "@nestjs/common";
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

	// @Post("/create-json-data")
	// async createJsonData(@Body() data: {
	// 	name: string,
	// 	lastName: string,
	// 	age: number
	// }): Promise<any> {
	// 	return await this.applicationFunction.createDemoDataType(data);
	// }
}