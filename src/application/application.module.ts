import { forwardRef, Module } from "@nestjs/common";
import { ApplicationFunction } from "./usecases/application.function";
import { PrismaClient } from "@prisma/client";
import { GetUserByIdUseCase } from "./usecases/users/get-user-by-id.usecase";
import { PrismaUsersRepositoryAdapter } from "../infrastructure/repositories/prisma.users.repository.adapter";
import { GetAuthenticatedUserUseCase } from "./usecases/users/get-authenticated-user.usecase";
import { GetUserByEmailUseCase } from "./usecases/users/get-user-by-email.usecase";
import { GetUserWithRefreshTokenUseCase } from "./usecases/users/get-user-with-refresh-token.usecase";
import { CreateUserUseCase } from "./usecases/users/create-user.usecase";
import { SignInUseCase } from "./usecases/auth/sign-in.usecase";
import { SignUpUseCase } from "./usecases/auth/sign-up.usecase";
import { PrismaAuthRepositoryAdapter } from "../infrastructure/repositories/prisma.auth.repository.adapter";
import { JwtModule } from "@nestjs/jwt";
import { RefreshAccessTokenUseCase } from "./usecases/auth/refresh-access-token.usecase";
import { EditUserProfileUseCase } from "./usecases/users/edit-user-profile.usecase";
import { PrismaAthletesRepositoryAdapter } from "../infrastructure/repositories/prisma.athletes.repository.adapter";
import { RegisterTournamentUseCase } from "./usecases/athletes/register-tournament.usecase";
import { GetParticipatedTournamentsUseCase } from "./usecases/athletes/get-participated-tournaments.usecase";
import { RegisterNewRoleUseCase } from "./usecases/athletes/register-new-role.usecase";
import { UploadVerificationImagesUseCase } from "./usecases/athletes/upload-verification-images.usecase";
import { MailService } from "../infrastructure/services/mail.service";
import { VerifyOTPUseCase } from "./usecases/auth/verify-otp.usecase";
import { ChangePasswordUseCase } from "./usecases/users/change-password.usecase";
import { PrismaStaffsRepositoryAdapter } from "../infrastructure/repositories/prisma.staffs.repository.adapter";
import { SendResetPasswordLinkUseCase } from "./usecases/auth/send-reset-password-link.usecase";
import { ResetPasswordUseCase } from "./usecases/auth/reset-password.usecase";
import { VerifyUserInformationUseCase } from "./usecases/staffs/verify-user-information.usecase";
import { EmailQueueModule } from "../infrastructure/background-jobs/email/email.queue.module";
import { PrismaPackageRepositoryAdapter } from "src/infrastructure/repositories/prisma.package.repository.adapter";
import { GetPackagesUseCase } from "./usecases/packages/get-packages.usecase";
import { NotificationQueueModule } from "../infrastructure/background-jobs/notification/notification.queue.module";
import { PrismaNotificationsRepositoryAdapter } from "../infrastructure/repositories/prisma.notifications.repository.adapter";
import { GetNotificationByUserUseCase } from "./usecases/notification/get-notification-by-user.usecase";
import { CreateNotificationUseCase } from "./usecases/notification/create-notification.usecase";
import {PrismaService} from "../infrastructure/services/prisma.service";
import { CreatePaymentLinkUseCase } from "./usecases/payment/create-payment-link.usecase";
import { InfrastructureModule } from "src/infrastructure/infrastructure.module";
import { PaymentPayOSService } from "./services/payment.service";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [JwtModule.register({}), EmailQueueModule, NotificationQueueModule, ConfigModule],
	controllers: [],
	providers: [
		{
			provide: PrismaClient,
			useValue: new PrismaClient(),
		},

		{
			provide: "AuthRepository",
			useClass: PrismaAuthRepositoryAdapter,
		},

		{
			provide: "UserRepository",
			useClass: PrismaUsersRepositoryAdapter,
		},

		{
			provide: "AthleteRepository",
			useClass: PrismaAthletesRepositoryAdapter,
		},
		{
			provide: "StaffRepository",
			useClass: PrismaStaffsRepositoryAdapter,
		},
		{
			provide: "PackageRepository",
			useClass: PrismaPackageRepositoryAdapter,
		},
		{
			provide: "NotificationRepository",
			useClass: PrismaNotificationsRepositoryAdapter,
		},

		MailService,
		PaymentPayOSService,
		PrismaService,
		ApplicationFunction,
		GetUserByIdUseCase,
		GetAuthenticatedUserUseCase,
		GetUserByEmailUseCase,
		GetUserWithRefreshTokenUseCase,
		CreateUserUseCase,
		SignInUseCase,
		SignUpUseCase,
		RefreshAccessTokenUseCase,
		EditUserProfileUseCase,
		RegisterTournamentUseCase,
		GetParticipatedTournamentsUseCase,
		RegisterNewRoleUseCase,
		UploadVerificationImagesUseCase,
		VerifyOTPUseCase,
		ChangePasswordUseCase,
		VerifyUserInformationUseCase,
		SendResetPasswordLinkUseCase,
		ResetPasswordUseCase,
		GetPackagesUseCase,
		CreatePaymentLinkUseCase,
		GetPackagesUseCase,
		GetNotificationByUserUseCase,
		CreateNotificationUseCase,
	],
	exports: [
		ApplicationFunction,
		GetUserByIdUseCase,
		GetAuthenticatedUserUseCase,
		GetUserByEmailUseCase,
		GetUserWithRefreshTokenUseCase,
		CreateUserUseCase,
		SignInUseCase,
		SignUpUseCase,
		RefreshAccessTokenUseCase,
		EditUserProfileUseCase,
		RegisterTournamentUseCase,
		ChangePasswordUseCase,
		GetParticipatedTournamentsUseCase,
		RegisterNewRoleUseCase,
		UploadVerificationImagesUseCase,
		VerifyOTPUseCase,
		VerifyUserInformationUseCase,
		SendResetPasswordLinkUseCase,
		ResetPasswordUseCase,
		GetNotificationByUserUseCase,
		CreateNotificationUseCase,
		GetPackagesUseCase,
		CreatePaymentLinkUseCase,
		PaymentPayOSService,
	],
})
export class ApplicationModule {}
