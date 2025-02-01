import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ApplicationModule } from "./application/application.module";
import { DomainModule } from "./domain/domain.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ApplicationModule,
		DomainModule,
		InfrastructureModule,
		ConfigModule.forRoot({
			isGlobal: true, // Makes ConfigModule globally available without needing to import it in other modules
			envFilePath: ".env", // Specify the path to your .env file (default is `.env`)
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
