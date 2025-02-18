import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ApplicationModule } from "./application/application.module";
import { DomainModule } from "./domain/domain.module";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullModule } from "@nestjs/bullmq";

@Module({
	imports: [
		ApplicationModule,
		DomainModule,
		InfrastructureModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ".env",
		}),
		BullModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				connection: {
					host: configService.get("REDIS_HOST"),
					port: configService.get("REDIS_PORT"),
				},
			}),
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
