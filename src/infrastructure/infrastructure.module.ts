import { Tournament } from "@prisma/client";
import { forwardRef, Module } from "@nestjs/common";
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
import { PackageController } from "./controllers/package.controller";
import { StaffController } from "./controllers/staff.controller";
import { EmailQueueModule } from "./background-jobs/email/email.queue.module";
import { NotificationQueueModule } from "./background-jobs/notification/notification.queue.module";
import { NotificationController } from "./controllers/notification.controller";
import { PrismaService } from "./services/prisma.service";
import { PaymentController } from "./controllers/payment.controller";
import { TournamentController } from "./controllers/tournament.controller";
import { UploadService } from "./services/upload.service";
import { TeamLeaderController } from "./controllers/team-leader.controller";
import { TeamQueueModule } from "./background-jobs/team/team.queue.module";
import { GoogleStrategy } from "./strategies/auth/google.strategy";
import { TeamController } from "./controllers/team.controller";
import { OrganizerController } from "./controllers/organizers.controller";
import { PaymentPayOSService } from "../application/services/payment.service";
import { UmpireController } from "./controllers/umpire.controller";
import { MatchController } from "./controllers/match.controller";
import { BankController } from "./controllers/bank.controller";
import { SponsorController } from "./controllers/sponsor.controller";
import { BankLookUpService } from "./services/bank-lookup.service";
import { TournamentQueueModule } from "./background-jobs/tournament/tournament.queue.module";
import { CourtController } from "./controllers/court.controller";
import { ReportController } from "./controllers/report.controller";

@Module({
	imports: [
		forwardRef(() => ApplicationModule),
		PassportModule,
		JwtModule.register({}),
		ConfigModule,
		EmailQueueModule,
		NotificationQueueModule,
		TeamQueueModule,
		TournamentQueueModule,
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
					dir: join(
						__dirname,
						"..",
						configService.get<string>("MAILER_TEMPLATE_URL"),
					),
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
		StaffController,
		PackageController,
		NotificationController,
		PaymentController,
		TournamentController,
		TeamLeaderController,
		TeamController,
		OrganizerController,
		UmpireController,
		MatchController,
		BankController,
		SponsorController,
		CourtController,
		ReportController
	],
	providers: [
		LocalStrategy,
		JwtAccessTokenStrategy,
		JwtRefreshTokenStrategy,
		GoogleStrategy,
		MailService,
		PrismaService,
		UploadService,
		ConfigService,
		BankLookUpService,
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
		PaymentPayOSService,
	],
	exports: [MailService, UploadService, BankLookUpService, ConfigService],
})
export class InfrastructureModule {}
