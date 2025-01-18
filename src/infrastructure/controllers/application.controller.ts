import { Controller, Get } from "@nestjs/common";
import { ApplicationFunction } from "src/application/usecases/application.function";

@Controller('/application')
export class ApplicationController {
	constructor(private applicationFunction: ApplicationFunction) {

	}
	@Get('api-version')
	getVersioningAPI() {
		return this.applicationFunction.getApiVersion();
	}
}