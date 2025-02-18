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
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailService } from "./services/mail.service";
import { join } from "path";
import {StaffController} from "./controllers/staff.controller";

@Module({
	imports: [
		ApplicationModule,
		PassportModule,
		JwtModule.register({}),
		ConfigModule,
		MailerModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				transport: {
					host: "smtp.gmail.com",
					port: 465,
					secure: true,
					auth: {
						user: configService.get<string>("NODEMAILER_USER"),
						pass: configService.get<string>("NODEMAILER_PASS"),
					},
				},

				template: {
					dir: join(__dirname, "..", configService.get<string>("MAILER_TEMPLATE_URL")),
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [
		ApplicationController,
		UsersController,
		AuthController,
		AthletesController,
		StaffController
	],
	providers: [
		LocalStrategy,
		JwtAccessTokenStrategy,
		JwtRefreshTokenStrategy,
		MailService,
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
	exports: [MailService],
})
export class InfrastructureModule {}
