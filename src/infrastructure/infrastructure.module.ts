import { Module } from "@nestjs/common";
import { ApplicationController } from "./controllers/application.controller";
import { ApplicationFunction } from "src/application/usecases/application.function";
import { ApplicationModule } from "src/application/application.module";

@Module({
	imports: [ApplicationModule],
	controllers: [ApplicationController],
	providers: [],
	exports: []
})
export class InfrastructureModule {}