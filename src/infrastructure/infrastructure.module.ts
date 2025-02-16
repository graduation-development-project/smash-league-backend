import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config"; // ✅ Import ConfigModule
import { ApplicationController } from "./controllers/application.controller";
import { ApplicationModule } from "src/application/application.module";
import { UsersController } from "./controllers/users.controller";
import { LocalStrategy } from "./strategies/auth/local.strategy";
import { JwtAccessTokenStrategy } from "./strategies/auth/jwt-access-token.strategy";
import { JwtRefreshTokenStrategy } from "./strategies/auth/jwt-refresh-token.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./controllers/auth.controller";
import { AthletesController } from "./controllers/athletes.controller";
import { v2 as cloudinary } from "cloudinary";

@Module({
	imports: [
		ApplicationModule,
		PassportModule,
		JwtModule.register({}),
		ConfigModule, // ✅ Ensure ConfigModule is imported
	],
	controllers: [
		ApplicationController,
		UsersController,
		AuthController,
		AthletesController,
	],
	providers: [
		LocalStrategy,
		JwtAccessTokenStrategy,
		JwtRefreshTokenStrategy,
		{
			provide: "CLOUDINARY",
			useFactory: (configService: ConfigService) => {
				return cloudinary.config({
					cloud_name: configService.get<string>("CLOUDINARY_NAME"),
					api_key: configService.get<string>("CLOUDINARY_API_KEY"),
					api_secret: configService.get<string>("CLOUDINARY_API_SECRET"),
				});
			},
			inject: [ConfigService],
		},
	],
	exports: [],
})
export class InfrastructureModule {}
