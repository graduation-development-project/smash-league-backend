import { Module } from "@nestjs/common";
import { ApplicationController } from "./controllers/application.controller";

@Module({
	imports: [],
	controllers: [ApplicationController],
	providers: [],
	exports: []
})
export class InfrastructureModule {}