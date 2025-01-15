import { Controller, Get } from "@nestjs/common";

@Controller('api/v1/application')
export class ApplicationController {
	@Get('api-version')
	getVersioningAPI() {
		return '1.0.0';
	}
}