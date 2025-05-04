import { UpdateRegistrationInformationUseCase } from "./usecases/tournament/update-registration-information.usecase";
import { GetParticipantsOfTournamentEventUseCase } from "./usecases/tournament/tournament-event/get-participants-of-tournament-event.usecase";
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
import { PrismaTournamentRepositoryAdapter } from "src/infrastructure/repositories/prisma.tournament.repository.adapter";
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
import { SearchTournamentUseCase } from "./usecases/tournament/search-tournament.usecase";
import { ModifyTournamentSerieUseCase } from "./usecases/tournament-serie/modify-tournament-serie.usecase";
import { SearchUserByEmailUseCase } from "./usecases/users/search-user-by-email.usecase";
import { GetAllTournamentSeriesUseCase } from "./usecases/tournament-serie/get-all-tournament-series.usecase";
import { PrismaOrganizersRepositoryAdapter } from "../infrastructure/repositories/prisma.organizers.repository.adapter";
import { ResponseTournamentRegistrationUseCase } from "./usecases/organizers/response-tournament-registration.usecase";
import { CreateTournamentSerieUseCase } from "./usecases/tournament-serie/create-tournament-serie.usecase";
import { CheckExistTournamentURLUseCase } from "./usecases/tournament/check-exist-tournament-url.usecase";
import { CreateRandomURLUseCase } from "./usecases/tournament/create-random-url.usecase";
import { UploadBackgroundImageUseCase } from "./usecases/tournament/upload-background-image.usecase";
import { GetTournamentRegistrationByTournamentIdUseCase } from "./usecases/organizers/get-tournament-registration-by-tournament-id.usecase";
import { GetTournamentDetailUseCase } from "./usecases/tournament/get-tournament-detail.usecase";
import { GetMyTournamentSerieUseCase } from "./usecases/tournament-serie/get-my-tournament-serie.usecase";
import { BuyPackageUseCase } from "./usecases/payment/buy-package.usecase";
import { PrismaOrderRepositoryAdapter } from "src/infrastructure/repositories/prisma.order.repository.adapter";
import { PrismaTransactionRepositoryAdapter } from "src/infrastructure/repositories/prisma.transaction.repository.adapter";
import { AcceptPaymentUseCase } from "./usecases/payment/accept-payment.usecase";
import { RejectPaymentUseCase } from "./usecases/payment/reject-payment.usecase";
import { UpdateTournamentUseCase } from "./usecases/tournament/update-tournament.usecase";
import { GetTournamentParticipantsByTournamentIdUseCase } from "./usecases/organizers/get-tournament-participants-by-tournament-id.usecase";
import { UploadMerchandiseImagesUseCase } from "./usecases/tournament/upload-merchandise-images.usecase";
import { GenerateBracketUseCase } from "./usecases/tournament/generate-bracket.usecase";
import { GetAllVerificationRequestUseCase } from "./usecases/staffs/get-all-verification-request.usecase";
import { PrismaStageRepositoryAdapTer } from "src/infrastructure/repositories/prisma.stage.repository.adapter";
import { GetMatchesOfStageUseCase } from "./usecases/tournament/tournament-event/get-matches-of-stage.usecase";
import { PrismaMatchRepositoryAdapter } from "src/infrastructure/repositories/prisma.match.repository.adapter";
import { AssignUmpireUseCase } from "./usecases/organizers/assign-umpire.usecase";
import { GetUserProfileUseCase } from "./usecases/users/get-user-profile.usecase";
import { PrismaUmpireRepositoryAdapter } from "src/infrastructure/repositories/prisma.umpire.repository.adapter";
import { GetMatchesOfTournamentEventUseCase } from "./usecases/tournament/tournament-event/get-matches-of-tournament-event.usecase";
import { GetOwnedTournamentUseCase } from "./usecases/organizers/get-owned-tournament.usecase";
import { GetTournamentPostUseCase } from "./usecases/tournament/get-tournament-post.usecase";
import { UmpireUpdateMatchUseCase } from "./usecases/umpires/umpire-update-match.usecase";
import { GetUmpireRegistrationUseCase } from "./usecases/organizers/get-umpire-registration.usecase";
import { GetTournamentEventsByTournamentIdUseCase } from "./usecases/tournament/tournament-event/get-tournament-events-by-tournament-id.usecase";
import { GetTournamentRegistrationByUserIdUseCase } from "./usecases/athletes/get-tournament-registration-by-user-id.usecase";
import { UpdateAttendanceUseCase } from "./usecases/tournament/match/update-attendance.usecase";
import { UpdateForfeitCompetitorUseCase } from "./usecases/tournament/match/update-forfeit-competitor.usecase,";
import { GetUserTransactionUseCase } from "./usecases/payment/get-user-transaction.usecase";
import { GetTournamentUmpireUseCase } from "./usecases/tournament/get-tournament-umpire.usecase";
import { StartMatchUseCase } from "./usecases/tournament/match/start-match.usecase";
import { UpdatePointUseCase } from "./usecases/tournament/match/update-point.usecase";
import { PrismaGameRepositoryAdapter } from "src/infrastructure/repositories/prisma.game.repository.adapter";
import { GetTournamentsByUserIdUseCase } from "./usecases/tournament/get-tournaments-by-user-id.usecase";
import { PrismaCourtRepositoryAdapter } from "src/infrastructure/repositories/prisma.court.repository.adapter";
import { AssignCourtForMatchUseCase } from "./usecases/tournament/court/assign-court-for-match.usecase";
import { GetCourtAvailableUseCase } from "./usecases/tournament/court/get-court-available.usecase";
import { GetTeamMembersByTeamLeaderUseCase } from "./usecases/teams/get-team-members-by-team-leader.usecase";
import { GetAssignedMatchUseCase } from "./usecases/umpires/get-assigned-match.usecase";
import { GetUmpireParticipatedTournamentsUseCase } from "./usecases/umpires/get-participated-tournaments.usecase";
import { GetMatchByIdUseCase } from "./usecases/tournament/match/get-match-by-id.usecase";
import { GetTournamentEventStandingBoardUseCase } from "./usecases/tournament/tournament-event/get-tournament-event-standing-board.usecase";
import { RegisterTournamentForTeamUseCase } from "./usecases/team-leader/register-tournament-for-team.usecase";
import { AssignAthleteIntoMatchUseCase } from "./usecases/tournament/match/assign-athlete-into-match.usecase";
import { PayRegistrationFeeUseCase } from "./usecases/payment/pay-registration-fee.usecase";
import { PrismaTournamentRegistrationRepositoryAdapter } from "../infrastructure/repositories/prisma.tournament-registration.repository.adapter";
import { PrismaTournamentParticipantRepositoryAdapter } from "../infrastructure/repositories/prisma.tournament-participant.repository.adapter";
import { PrismaBankRepositoryAdapter } from "../infrastructure/repositories/prisma.bank.repository.adapter";
import { GetAllBanksUseCase } from "./usecases/bank/get-all-banks.usecase";
import { AddBankAccountUseCase } from "./usecases/users/add-bank-account.usecase";
import { PaybackRegistrationFeeUseCase } from "./usecases/payment/payback-registration-fee.usecase";
import { GetFeatureTournamentsUseCase } from "./usecases/tournament/get-feature-tournaments.usecase";
import { GetTournamentsByOrganizerIdUseCase } from "./usecases/tournament/get-tournaments-by-organizer-id.usecase";
import { GetParticipantsByTournamentEventUseCase } from "./usecases/tournament/tournament-event/get-participants-by-tournament-event.usecase";
import { RemoveTournamentRegistrationUseCase } from "./usecases/athletes/remove-tournament-registration.usecase";
import { PrismaFeedbackRepositoryAdapter } from "../infrastructure/repositories/prisma.feedback.repository.adapter";
import { CreateFeedbackUseCase } from "./usecases/feedback/create-feedback.usecase";
import { GetFeedbacksByTournamentUseCase } from "./usecases/feedback/get-feedbacks-by-tournament.usecase";
import { GetFeedbacksByUserUseCase } from "./usecases/feedback/get-feedbacks-by-user.usecase";
import { RemoveManyTournamentRegistrationsUseCase } from "./usecases/athletes/remove-many-tournament-registrations.usecase";
import { UpdateTournamentInformationUseCase } from "./usecases/tournament/update-tournament-information.usecase";
import { UpdateContactForTournamentUseCase } from "./usecases/tournament/update-contact-for-tournament.usecase";
import { GetTournamentInformationUseCase } from "./usecases/tournament/get-tournament-information.usecase";
import { GetTournamentContactUseCase } from "./usecases/tournament/get-tournament-contact.usecase";
import { GetTournamentRegistrationInformationUseCase } from "./usecases/tournament/get-tournament-registration-information.usecase";
import { PrismaSponsorsRepositoryAdapter } from "../infrastructure/repositories/prisma.sponsors.repository.adapter";
import { PrismaTournamentSponsorAdapter } from "../infrastructure/repositories/prisma.tournament-sponsor.adapter";
import { CreateTournamentSponsorUseCase } from "./usecases/tournament/sponsor/create-tournament-sponsor.usecase";
import { FindTournamentSponsorUseCase } from "./usecases/tournament/sponsor/find-tournament-sponsor.usecase";
import { GetAllSponsorUseCase } from "./usecases/tournament/sponsor/get-all-sponsor.usecase";
import { PrismaPaybackFeeRepositoryAdapter } from "../infrastructure/repositories/prisma.payback-fee.repository.adapter";
import { CancelTournamentUseCase } from "./usecases/tournament/cancel-tournament.usecase";
import { UploadAvatarUseCase } from "./usecases/users/upload-avatar.usecase";
import { GetAllAssignedMatchesUsecase } from "./usecases/umpires/get-all-assigned-matches.usecase";
import { GetAllPaybackFeeListUseCase } from "./usecases/staffs/get-all-payback-fee-list.usecase";
import { UpdateTournamentEventInformationUseCase } from "./usecases/tournament/update-tournament-event-information.usecase";
import { GetMatchesOfUserUseCase } from "./usecases/athletes/get-matches-of-user.usecase";
import { UpdateMatchUseCase } from "./usecases/organizers/update-match.usecase";
import { UpdateTournamentScheduleInformationUseCase } from "./usecases/tournament/update-tournament-schedule-information.usecase";
import { BankLookUpService } from "src/infrastructure/services/bank-lookup.service";
import { CheckBankAccountExistUseCase } from "./usecases/bank/check-bank-account-exist.usecase";
import { GetLatestFinishTournamentUseCase } from "./usecases/tournament/get-latest-finish-tournament.usecase";
import { EditTournamentSponsorTierUseCase } from "./usecases/tournament/sponsor/edit-tournament-sponsor-tier.usecase";
import { RemoveTournamentSponsorUseCase } from "./usecases/tournament/sponsor/remove-tournament-sponsor.usecase";
import { PrismaTournamentUmpireRepositoryAdapter } from "../infrastructure/repositories/prisma.tournament-umpire.repository.adapter";
import { GetAllRequiredAttachmentUseCase } from "./usecases/tournament/get-all-required-attachment.usecase";
import { UpdatePackageUseCase } from "./usecases/packages/update-package.usecase";
import { TournamentQueueModule } from "../infrastructure/background-jobs/tournament/tournament.queue.module";
import { PrismaMatchLogRepositoryAdapter } from "src/infrastructure/repositories/match-log.repository.adapter";
import { CreateEventLogUseCase } from "./usecases/tournament/match/create-event-log.usecase";
import { GetAllLogMessageUseCase } from "./usecases/tournament/match/get-all-log-message.usecase";
import { GetAllLogTypeUseCase } from "./usecases/tournament/match/get-all-logtype.usecase";
import { GetUserByRoleUseCase } from "./usecases/users/get-user-by-role.usecase";
import { GetLatestMatchesUseCase } from "./usecases/athletes/get-latest-matches.usecase";
import { ContinueMatchUseCase } from "./usecases/tournament/match/continue-match.usecase";
import { GetAllMatchLogUseCase } from "./usecases/tournament/match/get-all-match-log.usecase";
import { UpdateCourtUseCase } from "./usecases/tournament/court/update-court.usecase";
import { UpdateTournamentMerchandiseUseCase } from "./usecases/tournament/update-tournament-merchandise.usecase";

@Module({
	imports: [
		JwtModule.register({}),
		EmailQueueModule,
		NotificationQueueModule,
		TeamQueueModule,
		TournamentQueueModule,
		ConfigModule,
		forwardRef(() => InfrastructureModule),
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
			useClass: PrismaTournamentRepositoryAdapter,
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
			useClass: PrismaTournamentSerieRepositoryAdapter,
		},
		{
			provide: "TournamentEventRepository",
			useClass: PrismaTournamentEventRepositoryAdapter,
		},

		{
			provide: "OrganizerRepository",
			useClass: PrismaOrganizersRepositoryAdapter,
		},
		{
			provide: "OrderRepository",
			useClass: PrismaOrderRepositoryAdapter,
		},
		{
			provide: "TransactionRepository",
			useClass: PrismaTransactionRepositoryAdapter,
		},
		{
			provide: "StageRepository",
			useClass: PrismaStageRepositoryAdapTer,
		},
		{
			provide: "MatchRepository",
			useClass: PrismaMatchRepositoryAdapter,
		},
		{
			provide: "UmpireRepository",
			useClass: PrismaUmpireRepositoryAdapter,
		},
		{
			provide: "GameRepository",
			useClass: PrismaGameRepositoryAdapter,
		},
		{
			provide: "CourtRepository",
			useClass: PrismaCourtRepositoryAdapter,
		},
		{
			provide: "TournamentRegistrationRepositoryPort",
			useClass: PrismaTournamentRegistrationRepositoryAdapter,
		},
		{
			provide: "TournamentParticipantRepositoryPort",
			useClass: PrismaTournamentParticipantRepositoryAdapter,
		},
		{
			provide: "TournamentUmpireRepositoryPort",
			useClass: PrismaTournamentUmpireRepositoryAdapter,
		},

		{
			provide: "BankRepositoryPort",
			useClass: PrismaBankRepositoryAdapter,
		},

		{
			provide: "FeedbackRepositoryPort",
			useClass: PrismaFeedbackRepositoryAdapter,
		},

		{
			provide: "SponsorRepositoryPort",
			useClass: PrismaSponsorsRepositoryAdapter,
		},

		{
			provide: "TournamentSponsorRepositoryPort",
			useClass: PrismaTournamentSponsorAdapter,
		},
		{
			provide: "PaybackFeeRepositoryPort",
			useClass: PrismaPaybackFeeRepositoryAdapter,
		},
		{
			provide: "MatchLogRepositoryPort",
			useClass: PrismaMatchLogRepositoryAdapter,
		},
		//Third Party Service
		MailService,
		UploadService,
		PaymentPayOSService,
		PrismaService,
		BankLookUpService,
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
		SearchUserByEmailUseCase,
		GetUserProfileUseCase,
		GetTournamentRegistrationByUserIdUseCase,
		GetUserTransactionUseCase,
		AddBankAccountUseCase,
		RemoveTournamentRegistrationUseCase,
		RemoveManyTournamentRegistrationsUseCase,
		CreateFeedbackUseCase,
		GetFeedbacksByTournamentUseCase,
		GetFeedbacksByUserUseCase,
		UploadAvatarUseCase,
		GetMatchesOfUserUseCase,
		GetUserByRoleUseCase,
		GetLatestMatchesUseCase,
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
		GetTeamMembersByTeamLeaderUseCase,
		//Tournament Use Case
		GetParticipatedTournamentsUseCase,
		RegisterTournamentUseCase,
		SearchTournamentUseCase,
		GetAllBadmintonParticipantTypeUseCase,
		GetAllFormatTypeUseCase,
		CreateNewTournamentUseCase,
		CheckExistTournamentURLUseCase,
		CreateRandomURLUseCase,
		UploadBackgroundImageUseCase,
		UploadMerchandiseImagesUseCase,
		GetTournamentDetailUseCase,
		UpdateTournamentUseCase,
		GetParticipantsOfTournamentEventUseCase,
		GetParticipantsByTournamentEventUseCase,
		GenerateBracketUseCase,
		GetMatchesOfStageUseCase,
		GetTournamentPostUseCase,
		GetMatchesOfTournamentEventUseCase,
		GetTournamentEventsByTournamentIdUseCase,
		GetTournamentUmpireUseCase,
		GetTournamentsByUserIdUseCase,
		GetTournamentEventStandingBoardUseCase,
		RegisterTournamentForTeamUseCase,
		GetFeatureTournamentsUseCase,
		GetTournamentsByOrganizerIdUseCase,
		UpdateTournamentInformationUseCase,
		UpdateContactForTournamentUseCase,
		GetTournamentInformationUseCase,
		GetTournamentContactUseCase,
		UpdateRegistrationInformationUseCase,
		GetTournamentRegistrationInformationUseCase,
		CreateTournamentSponsorUseCase,
		FindTournamentSponsorUseCase,
		GetAllSponsorUseCase,
		CancelTournamentUseCase,
		UpdateTournamentEventInformationUseCase,
		UpdateTournamentScheduleInformationUseCase,
		GetLatestFinishTournamentUseCase,
		EditTournamentSponsorTierUseCase,
		RemoveTournamentSponsorUseCase,
		GetAllRequiredAttachmentUseCase,
		UpdateCourtUseCase,
		UpdateTournamentMerchandiseUseCase,
		//Tournament Series Use Case
		ModifyTournamentSerieUseCase,
		GetAllTournamentSeriesUseCase,
		CreateTournamentSerieUseCase,
		GetMyTournamentSerieUseCase,

		//Match Use Case
		UpdateAttendanceUseCase,
		UpdateForfeitCompetitorUseCase,
		StartMatchUseCase,
		UpdatePointUseCase,
		GetMatchByIdUseCase,
		AssignAthleteIntoMatchUseCase,
		UpdateMatchUseCase,
		CreateEventLogUseCase,
		GetAllLogMessageUseCase,
		GetAllLogTypeUseCase,
		ContinueMatchUseCase,
		GetAllMatchLogUseCase,
		//Court Use Case
		AssignCourtForMatchUseCase,
		GetCourtAvailableUseCase,
		// GetTeamListUseCase,
		SearchTeamsUseCase,
		GetTournamentsOfTournamentSerieUseCase,
		// UploadVerificationImagesUseCase,

		//Package Use Case
		GetPackagesUseCase,
		GetPackageDetailUseCase,
		CreatePackageUseCase,
		InactivatePackageUseCase,
		UpdatePackageUseCase,
		//Payment Use Case
		CreatePaymentLinkUseCase,
		BuyPackageUseCase,
		AcceptPaymentUseCase,
		RejectPaymentUseCase,
		PayRegistrationFeeUseCase,
		PaybackRegistrationFeeUseCase,
		//Notification Use Case
		GetNotificationByUserUseCase,
		CreateNotificationUseCase,

		//Organizer Use Case
		ResponseTournamentRegistrationUseCase,
		GetTournamentRegistrationByTournamentIdUseCase,
		GetTournamentParticipantsByTournamentIdUseCase,
		AssignUmpireUseCase,
		GetOwnedTournamentUseCase,
		GetUmpireRegistrationUseCase,

		//Staff Use Case
		VerifyUserInformationUseCase,
		GetAllVerificationRequestUseCase,
		GetAllPaybackFeeListUseCase,

		//Umpire Use Case
		UmpireUpdateMatchUseCase,
		GetAssignedMatchUseCase,
		GetAllAssignedMatchesUsecase,
		GetUmpireParticipatedTournamentsUseCase,

		//Bank Use Case
		GetAllBanksUseCase,
		CheckBankAccountExistUseCase,
	],
	exports: [
		//Auth Service
		AuthService,
		PaymentPayOSService,
		ApplicationFunction,
		//User use case
		GetUserByIdUseCase,
		GetAuthenticatedUserUseCase,
		GetUserByEmailUseCase,
		GetUserWithRefreshTokenUseCase,
		CreateUserUseCase,
		EditUserProfileUseCase,
		SearchUserByEmailUseCase,
		GetUserProfileUseCase,
		GetTournamentRegistrationByUserIdUseCase,
		GetUserTransactionUseCase,
		AddBankAccountUseCase,
		RemoveTournamentRegistrationUseCase,
		RemoveManyTournamentRegistrationsUseCase,
		CreateFeedbackUseCase,
		GetFeedbacksByTournamentUseCase,
		GetFeedbacksByUserUseCase,
		UploadAvatarUseCase,
		GetMatchesOfUserUseCase,
		GetUserByRoleUseCase,
		GetLatestMatchesUseCase,
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
		GetTeamMembersByTeamLeaderUseCase,

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
		CheckExistTournamentURLUseCase,
		CreateRandomURLUseCase,
		UploadBackgroundImageUseCase,
		UploadMerchandiseImagesUseCase,
		GetTournamentDetailUseCase,
		UpdateTournamentUseCase,
		GetParticipantsOfTournamentEventUseCase,
		GetParticipantsByTournamentEventUseCase,
		GenerateBracketUseCase,
		GetMatchesOfStageUseCase,
		GetMatchesOfTournamentEventUseCase,
		GetTournamentPostUseCase,
		GetTournamentEventsByTournamentIdUseCase,
		GetTournamentUmpireUseCase,
		GetTournamentsByUserIdUseCase,
		GetTournamentEventStandingBoardUseCase,
		RegisterTournamentForTeamUseCase,
		GetFeatureTournamentsUseCase,
		GetTournamentsByOrganizerIdUseCase,
		UpdateTournamentInformationUseCase,
		UpdateContactForTournamentUseCase,
		GetTournamentInformationUseCase,
		GetTournamentContactUseCase,
		UpdateRegistrationInformationUseCase,
		GetTournamentRegistrationInformationUseCase,
		CreateTournamentSponsorUseCase,
		FindTournamentSponsorUseCase,
		GetAllSponsorUseCase,
		CancelTournamentUseCase,
		UpdateTournamentEventInformationUseCase,
		UpdateTournamentScheduleInformationUseCase,
		GetLatestFinishTournamentUseCase,
		EditTournamentSponsorTierUseCase,
		RemoveTournamentSponsorUseCase,
		GetAllRequiredAttachmentUseCase,
		UpdateCourtUseCase,
		UpdateTournamentMerchandiseUseCase,
		//Tournament Serie Use Case,
		ModifyTournamentSerieUseCase,
		GetAllTournamentSeriesUseCase,
		CreateTournamentSerieUseCase,
		GetMyTournamentSerieUseCase,

		//Match Use Case
		UpdateAttendanceUseCase,
		UpdateForfeitCompetitorUseCase,
		StartMatchUseCase,
		UpdatePointUseCase,
		GetMatchByIdUseCase,
		AssignAthleteIntoMatchUseCase,
		UpdateMatchUseCase,
		CreateEventLogUseCase,
		GetAllLogMessageUseCase,
		GetAllLogTypeUseCase,
		ContinueMatchUseCase,
		GetAllMatchLogUseCase,
		//Court Use Case
		AssignCourtForMatchUseCase,
		GetCourtAvailableUseCase,

		// UploadVerificationImagesUseCase,

		//Package Use Case
		GetPackagesUseCase,
		GetPackageDetailUseCase,
		CreatePackageUseCase,
		InactivatePackageUseCase,
		UpdatePackageUseCase,
		//Payment Use Case
		CreatePaymentLinkUseCase,
		BuyPackageUseCase,
		AcceptPaymentUseCase,
		RejectPaymentUseCase,
		PayRegistrationFeeUseCase,
		PaybackRegistrationFeeUseCase,
		//Notification Use Case
		GetNotificationByUserUseCase,
		CreateNotificationUseCase,

		//Organizer Use Case
		ResponseTournamentRegistrationUseCase,
		GetTournamentRegistrationByTournamentIdUseCase,
		GetTournamentParticipantsByTournamentIdUseCase,
		AssignUmpireUseCase,
		GetOwnedTournamentUseCase,
		GetUmpireRegistrationUseCase,

		//Staff Use Case
		VerifyUserInformationUseCase,
		GetAllVerificationRequestUseCase,
		GetAllPaybackFeeListUseCase,

		//Umpire Use Case
		UmpireUpdateMatchUseCase,
		GetAssignedMatchUseCase,
		GetAllAssignedMatchesUsecase,
		GetUmpireParticipatedTournamentsUseCase,

		//Bank Use Case
		GetAllBanksUseCase,
		CheckBankAccountExistUseCase,
	],
})
export class ApplicationModule {}
