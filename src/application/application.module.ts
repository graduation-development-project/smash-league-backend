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
import { PrismaService } from "../infrastructure/services/prisma.service";
import { CreatePaymentLinkUseCase } from "./usecases/payment/create-payment-link.usecase";
import { InfrastructureModule } from "src/infrastructure/infrastructure.module";
import { PaymentPayOSService } from "./services/payment.service";
import { ConfigModule } from "@nestjs/config";
import { ResendOtpUseCase } from "./usecases/auth/resend-otp.usecase";
import { PrismaTournamentRepositorAdapter } from "src/infrastructure/repositories/prisma.tournament.repository.adapter";
import { UploadService } from "../infrastructure/services/upload.service";
import { PrismaTeamLeadersRepositoryAdapter } from "../infrastructure/repositories/prisma.team-leaders.repository.adapter";
import { CreateTeamUseCase } from "./usecases/team-leader/create-team.usecase";
import { SendTeamInvitationUseCase } from "./usecases/team-leader/send-team-invitation.usecase";
import { ResponseToTeamInvitationUseCase } from "./usecases/athletes/response-to-team-invitation.usecase";
import { GetAllBadmintonParticipantTypeUseCase } from "./usecases/tournament/get-all-badminton-participant-type.usecase";
import { GetAllFormatTypeUseCase } from "./usecases/tournament/get-all-format-type.usecase";
import { TeamQueueModule } from "../infrastructure/background-jobs/team/team.queue.module";
import { RemoveTeamUseCase } from "./usecases/team-leader/remove-team.usecase";
import { EditTeamUseCase } from "./usecases/team-leader/edit-team.usecase";
import { AuthService } from "./services/auth.service";
import { RemoveTeamMemberUseCase } from "./usecases/team-leader/remove-team-member.usecase";
import { LeaveTeamUseCase } from "./usecases/athletes/leave-team.usecase";
import { ResponseLeaveTeamRequestUseCase } from "./usecases/team-leader/response-leave-team-request.usecase";
import { RequestJoinTeamUseCase } from "./usecases/athletes/request-join-team.usecase";
import { ResponseJoinTeamRequestUseCase } from "./usecases/team-leader/response-join-team-request.usecase";
import { GetTeamMembersUseCase } from "./usecases/teams/get-team-members.usecase";
import { PrismaTeamsRepositoryAdapter } from "../infrastructure/repositories/prisma.teams.repository.adapter";
import { TransferTeamLeaderUseCase } from "./usecases/team-leader/transfer-team-leader.usecase";
import { ResponseTransferTeamLeaderUseCase } from "./usecases/athletes/response-transfer-team-leader.usecase";
import { GetTeamDetailUseCase } from "./usecases/teams/get-team-detail.usecase";
import { GetJoinedTeamsUseCase } from "./usecases/teams/get-joined-teams.usecase";
import { CreateNewTournamentUseCase } from "./usecases/tournament/create-new-tournament.useacase";
import { GetPackageDetailUseCase } from "./usecases/packages/get-package-detail.usecase";
import { CreatePackageUseCase } from "./usecases/packages/create-package.usecase";
import { InactivatePackageUseCase } from "./usecases/packages/inactivate-package.usecase";
// import { GetTeamListUseCase } from "./usecases/teams/get-team-list.usecase";
import { SearchTeamsUseCase } from "./usecases/teams/search-teams.usecase";
import { PrismaTournamentSerieRepositoryAdapter } from "src/infrastructure/repositories/prisma.tournament-serie.repository.adapter";
import { PrismaTournamentEventRepositoryAdapter } from "src/infrastructure/repositories/prisma.tournament-event.repository.adapter";
import { GetTournamentsOfTournamentSerieUseCase } from "./usecases/tournament-serie/get-tournaments-of-serie.usecase";
import {SearchTournamentUseCase} from "./usecases/tournament/search-tournament.usecase";
import { ModifyTournamentSerieUseCase } from "./usecases/tournament-serie/modify-tournament-serie.usecase";
import { SearchUserByEmailUseCase } from "./usecases/users/search-user-by-email.usecase";
import { GetAllTournamentSeriesUseCase } from "./usecases/tournament-serie/get-all-tournament-series.usecase";
import {PrismaOrganizersRepositoryAdapter} from "../infrastructure/repositories/prisma.organizers.repository.adapter";
import {ResponseTournamentRegistrationUseCase} from "./usecases/organizers/response-tournament-registration.usecase";
import {
	GetTournamentRegistrationByTournamentIdUseCase
} from "./usecases/organizers/get-tournament-registration-by-tournament-id.usecase";

@Module({
	imports: [
		JwtModule.register({}),
		EmailQueueModule,
		NotificationQueueModule,
		TeamQueueModule,
		ConfigModule,
	],
	controllers: [],
	providers: [
		//Prisma Client
		{
			provide: PrismaClient,
			useValue: new PrismaClient(),
		},
		//Providers for Repository Adapter
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
		{
			provide: "TournamentRepository",
			useClass: PrismaTournamentRepositorAdapter,
		},
		{
			provide: "TeamLeaderRepository",
			useClass: PrismaTeamLeadersRepositoryAdapter,
		},

		{
			provide: "TeamRepository",
			useClass: PrismaTeamsRepositoryAdapter,
		},
		{
			provide: "TournamentSerieRepository",
			useClass: PrismaTournamentSerieRepositoryAdapter
		},
		{
			provide: "TournamentEventRepository",
			useClass: PrismaTournamentEventRepositoryAdapter
		},

		{
			provide: "OrganizerRepository",
			useClass: PrismaOrganizersRepositoryAdapter
		},
		//Third Party Service
		MailService,
		UploadService,
		PaymentPayOSService,
		//Authentication Service
		AuthService,
		//Prisma Service
		PrismaService,
		ApplicationFunction,
		//User use case
		GetUserByIdUseCase,
		GetAuthenticatedUserUseCase,
		GetUserByEmailUseCase,
		GetUserWithRefreshTokenUseCase,
		CreateUserUseCase,
		EditUserProfileUseCase,
		VerifyUserInformationUseCase,
		SearchUserByEmailUseCase,
		//AuthenticationUseCase
		GetAuthenticatedUserUseCase,
		SignUpUseCase,
		SignInUseCase,
		RefreshAccessTokenUseCase,
		EditUserProfileUseCase,
		RegisterTournamentUseCase,
		GetParticipatedTournamentsUseCase,
		RegisterNewRoleUseCase,
		// UploadVerificationImagesUseCase,
		VerifyOTPUseCase,
		ChangePasswordUseCase,
		VerifyUserInformationUseCase,
		SendResetPasswordLinkUseCase,
		ResetPasswordUseCase,
		GetPackagesUseCase,
		CreatePaymentLinkUseCase,
		GetNotificationByUserUseCase,
		CreateNotificationUseCase,
		ResendOtpUseCase,
		//Role Use Case
		RegisterNewRoleUseCase,
		//Team Use Case
		CreateTeamUseCase,
		SendTeamInvitationUseCase,
		ResponseToTeamInvitationUseCase,
		RemoveTeamUseCase,
		EditTeamUseCase,
		RemoveTeamMemberUseCase,
		LeaveTeamUseCase,
		ResponseLeaveTeamRequestUseCase,
		RequestJoinTeamUseCase,
		ResponseJoinTeamRequestUseCase,
		GetTeamMembersUseCase,
		TransferTeamLeaderUseCase,
		ResponseTransferTeamLeaderUseCase,
		GetTeamDetailUseCase,
		GetJoinedTeamsUseCase,
		//Tournament Use Case
		GetParticipatedTournamentsUseCase,
		RegisterTournamentUseCase,
		SearchTournamentUseCase,
		GetAllBadmintonParticipantTypeUseCase,
		GetAllFormatTypeUseCase,
		CreateNewTournamentUseCase,
		//Tournament Series Use Case
		ModifyTournamentSerieUseCase,
		GetAllTournamentSeriesUseCase,
		// GetTeamListUseCase,
		SearchTeamsUseCase,
		GetTournamentsOfTournamentSerieUseCase,
		// UploadVerificationImagesUseCase,

		//Package Use Case
		GetPackagesUseCase,
		GetPackageDetailUseCase,
		CreatePackageUseCase,
		InactivatePackageUseCase,
		//Payment Use Case
		CreatePaymentLinkUseCase,

		//Notification Use Case
		GetNotificationByUserUseCase,
		CreateNotificationUseCase,

		//Organizer Use Case
		ResponseTournamentRegistrationUseCase,
		GetTournamentRegistrationByTournamentIdUseCase,
	],
	exports: [
		//Auth Service
		AuthService,

		ApplicationFunction,
		//User use case
		GetUserByIdUseCase,
		GetAuthenticatedUserUseCase,
		GetUserByEmailUseCase,
		GetUserWithRefreshTokenUseCase,
		CreateUserUseCase,
		EditUserProfileUseCase,
		VerifyUserInformationUseCase,
		SearchUserByEmailUseCase,
		//AuthenticationUseCase
		GetAuthenticatedUserUseCase,
		SignUpUseCase,
		SignInUseCase,
		RefreshAccessTokenUseCase,
		EditUserProfileUseCase,
		RegisterTournamentUseCase,
		ChangePasswordUseCase,
		GetParticipatedTournamentsUseCase,
		RegisterNewRoleUseCase,
		// UploadVerificationImagesUseCase,
		VerifyOTPUseCase,
		ChangePasswordUseCase,
		SendResetPasswordLinkUseCase,
		ResetPasswordUseCase,
		GetNotificationByUserUseCase,
		CreateNotificationUseCase,
		GetPackagesUseCase,
		CreatePaymentLinkUseCase,
		PaymentPayOSService,
		AuthService,
		ResendOtpUseCase,
		//Role Use Case
		RegisterNewRoleUseCase,

		//Team Use Case
		CreateTeamUseCase,
		SendTeamInvitationUseCase,
		ResponseToTeamInvitationUseCase,
		GetAllBadmintonParticipantTypeUseCase,
		GetAllFormatTypeUseCase,
		RemoveTeamUseCase,
		EditTeamUseCase,
		RemoveTeamMemberUseCase,
		LeaveTeamUseCase,
		ResponseLeaveTeamRequestUseCase,
		RequestJoinTeamUseCase,
		ResponseJoinTeamRequestUseCase,
		GetTeamMembersUseCase,
		TransferTeamLeaderUseCase,
		ResponseTransferTeamLeaderUseCase,
		GetTeamDetailUseCase,
		GetJoinedTeamsUseCase,
		// GetTeamListUseCase,
		SearchTeamsUseCase,
		//Tournament Use Case
		GetParticipatedTournamentsUseCase,
		RegisterTournamentUseCase,
		SearchTournamentUseCase,
		GetAllBadmintonParticipantTypeUseCase,
		GetAllFormatTypeUseCase,
		CreateNewTournamentUseCase,
		GetTournamentsOfTournamentSerieUseCase,
		//Tournament Serie Use Case,
		ModifyTournamentSerieUseCase,
		GetAllTournamentSeriesUseCase,
		// UploadVerificationImagesUseCase,

		//Package Use Case
		GetPackagesUseCase,
		GetPackageDetailUseCase,
		CreatePackageUseCase,
		InactivatePackageUseCase,
		//Payment Use Case
		CreatePaymentLinkUseCase,

		//Notification Use Case
		GetNotificationByUserUseCase,
		CreateNotificationUseCase,

		//Organizer Use Case
		ResponseTournamentRegistrationUseCase,
		GetTournamentRegistrationByTournamentIdUseCase,
	],
})
export class ApplicationModule {}
