import { Module } from "@nestjs/common";
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
import { MailService } from "../infrastructure/service/mail.service";
import { VerifyOTPUseCase } from "./usecases/auth/verify-otp.usecase";
import { ChangePasswordUseCase } from "./usecases/users/change-password.usecase";
import { PrismaStaffsRepositoryAdapter } from "../infrastructure/repositories/prisma.staffs.repository.adapter";
import { SendResetPasswordLinkUseCase } from "./usecases/auth/send-reset-password-link.usecase";
import { ResetPasswordUseCase } from "./usecases/auth/reset-password.usecase";
import { VerifyUserInformationUseCase } from "./usecases/staffs/verify-user-information.usecase";
import { EmailQueueModule } from "../infrastructure/background-jobs/email.queue.module";

@Module({
	imports: [JwtModule.register({}), EmailQueueModule],
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

		MailService,
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
		VerifyUserInformationUseCase,
		SendResetPasswordLinkUseCase,
		ResetPasswordUseCase,
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
		VerifyUserInformationUseCase,
		SendResetPasswordLinkUseCase,
		ResetPasswordUseCase,
	],
})
export class ApplicationModule {}
