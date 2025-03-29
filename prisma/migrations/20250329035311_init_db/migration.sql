-- CreateEnum
CREATE TYPE "Hands" AS ENUM ('LEFT', 'RIGHT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'WAITING_DISBAND');

-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('LEADER', 'MEMBER');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('CREATED', 'OPENING', 'OPENING_FOR_REGISTRATION', 'DRAWING', 'ON_GOING', 'FINISHED');

-- CreateEnum
CREATE TYPE "TypeOfFormat" AS ENUM ('SINGLE_ELIMINATION', 'ROUND_ROBIN');

-- CreateEnum
CREATE TYPE "BadmintonParticipantType" AS ENUM ('MENS_SINGLE', 'WOMENS_SINGLE', 'MENS_DOUBLE', 'WOMENS_DOUBLE', 'MIXED_DOUBLE');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('NOT_STARTED', 'ON_GOING', 'INTERVAL', 'ENDED');

-- CreateEnum
CREATE TYPE "TournamentRegistrationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TournamentRegistrationRole" AS ENUM ('ATHLETE', 'UMPIRE');

-- CreateEnum
CREATE TYPE "TeamRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TeamRequestType" AS ENUM ('JOIN_TEAM', 'LEAVE_TEAM', 'TRANSFER_TEAM_LEADER');

-- CreateEnum
CREATE TYPE "ReasonStatus" AS ENUM ('APPROVE', 'REJECT');

-- CreateEnum
CREATE TYPE "ReasonType" AS ENUM ('TOURNAMENT_REGISTRATION_REJECTION', 'USER_VERIFICATION_REJECTION', 'REMOVE_TEAM_MEMBER', 'OUT_TEAM_REJECTION', 'JOIN_TEAM_REJECTION');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BUYING_PAKCKAGE', 'PAY_REGISTRATION_FEE', 'PAYBACK_REGISTRATION_FEE');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESSFUL', 'FAILED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PAID', 'PENDING', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "avatarURL" TEXT,
    "currentRefreshToken" TEXT,
    "creditsRemain" INTEGER,
    "otp" TEXT,
    "gender" "Gender",
    "otpExpiresTime" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "teamId" TEXT,
    "height" INTEGER,
    "hands" "Hands",
    "dateOfBirth" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVerification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "IDCardFront" TEXT,
    "IDCardBack" TEXT,
    "cardPhoto" TEXT,
    "role" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "status" "TeamStatus" NOT NULL DEFAULT 'ACTIVE',
    "teamLeaderId" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTeam" (
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "role" "TeamRole" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "UserTeam_pkey" PRIMARY KEY ("userId","teamId")
);

-- CreateTable
CREATE TABLE "TeamInvitation" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "invitedUserId" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationType" (
    "id" TEXT NOT NULL,
    "typeOfNotification" TEXT NOT NULL,

    CONSTRAINT "NotificationType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "teamInvitationId" TEXT,
    "teamRequestId" TEXT,
    "tournamentRegistrationId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentSerie" (
    "id" TEXT NOT NULL,
    "tournamentSerieName" TEXT NOT NULL,
    "serieBackgroundImageURL" TEXT NOT NULL,
    "belongsToUserId" TEXT NOT NULL,

    CONSTRAINT "TournamentSerie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "description" TEXT NOT NULL,
    "introduction" TEXT,
    "organizerId" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "mainColor" TEXT,
    "backgroundTournament" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "registrationOpeningDate" TIMESTAMP(3) NOT NULL,
    "registrationClosingDate" TIMESTAMP(3) NOT NULL,
    "drawDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "checkInBeforeStart" TIMESTAMP(3) NOT NULL,
    "umpirePerMatch" INTEGER NOT NULL,
    "registrationFeePerPerson" INTEGER NOT NULL,
    "registrationFeePerPair" INTEGER,
    "maxEventPerPerson" INTEGER NOT NULL,
    "status" "TournamentStatus" NOT NULL,
    "protestFeePerTime" INTEGER NOT NULL,
    "prizePool" INTEGER NOT NULL,
    "hasMerchandise" BOOLEAN NOT NULL,
    "numberOfMerchandise" INTEGER,
    "merchandiseImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requiredAttachment" TEXT[],
    "isRecruit" BOOLEAN NOT NULL,
    "isPrivate" BOOLEAN NOT NULL,
    "isRegister" BOOLEAN NOT NULL,
    "isLiveDraw" BOOLEAN NOT NULL,
    "hasLiveStream" BOOLEAN NOT NULL,
    "tournamentSerieId" TEXT,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentEvent" (
    "id" TEXT NOT NULL,
    "tournamentEvent" "BadmintonParticipantType" NOT NULL,
    "fromAge" INTEGER DEFAULT 6,
    "toAge" INTEGER DEFAULT 90,
    "winningPoint" INTEGER DEFAULT 21,
    "lastPoint" INTEGER NOT NULL DEFAULT 31,
    "numberOfGames" INTEGER NOT NULL DEFAULT 3,
    "typeOfFormat" "TypeOfFormat" NOT NULL,
    "ruleOfEventExtension" TEXT,
    "minimumAthlete" INTEGER NOT NULL,
    "maximumAthlete" INTEGER,
    "championshipPrize" TEXT NOT NULL,
    "runnerUpPrize" TEXT NOT NULL,
    "thirdPlacePrize" TEXT,
    "jointThirdPlacePrize" TEXT,
    "tournamentId" TEXT NOT NULL,

    CONSTRAINT "TournamentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stage" (
    "id" TEXT NOT NULL,
    "stageName" TEXT NOT NULL,
    "tournamentEventId" TEXT NOT NULL,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "matchStatus" "MatchStatus" NOT NULL,
    "leftCompetitorId" TEXT,
    "rightCompetitorId" TEXT,
    "leftCompetitorAttendance" BOOLEAN DEFAULT false,
    "rightCompetitorAttendance" BOOLEAN DEFAULT false,
    "startedWhen" TIMESTAMP(3),
    "forfeitCompetitorId" TEXT,
    "matchWonByCompetitorId" TEXT,
    "umpireId" TEXT,
    "stageId" TEXT NOT NULL,
    "matchNumber" INTEGER NOT NULL,
    "isByeMatch" BOOLEAN NOT NULL,
    "tournamentEventId" TEXT NOT NULL,
    "nextMatchId" TEXT,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "leftCompetitorPoint" INTEGER NOT NULL,
    "rightCompetitorPoint" INTEGER NOT NULL,
    "gameNumber" INTEGER NOT NULL,
    "currentServerId" TEXT,
    "matchId" TEXT NOT NULL,
    "gameWonByCompetitorId" TEXT,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Point" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentRegistration" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "userId" TEXT,
    "tournamentEventId" TEXT NOT NULL,
    "partnerId" TEXT,
    "isPayForTheRegistrationFee" BOOLEAN NOT NULL DEFAULT false,
    "registrationDocumentCreator" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "registrationDocumentPartner" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "registrationRole" "TournamentRegistrationRole" NOT NULL,
    "status" "TournamentRegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromTeamId" TEXT,
    "reasonId" TEXT,

    CONSTRAINT "TournamentRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentParticipants" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tournamentEventId" TEXT NOT NULL,
    "partnerId" TEXT,

    CONSTRAINT "TournamentParticipants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentUmpires" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TournamentUmpires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentPost" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedByUserId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "backgroundImage" TEXT NOT NULL,

    CONSTRAINT "TournamentPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamRequest" (
    "id" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "status" "TeamRequestStatus" NOT NULL DEFAULT 'PENDING',
    "type" "TeamRequestType" NOT NULL,
    "leaveTeamReason" TEXT,

    CONSTRAINT "TeamRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reason" (
    "id" TEXT NOT NULL,
    "userVerificationId" TEXT,
    "tournamentRegistrationId" TEXT,
    "teamRequestId" TEXT,
    "userId" TEXT,
    "teamId" TEXT,
    "reason" TEXT NOT NULL,
    "status" "ReasonStatus",
    "type" "ReasonType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,

    CONSTRAINT "ContentImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "packageDetail" TEXT NOT NULL,
    "currentDiscountByAmount" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL,
    "advantages" TEXT[],
    "isRecommended" BOOLEAN NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "transactionDetail" TEXT NOT NULL,
    "transactionPaymentLink" TEXT,
    "transactionImage" TEXT,
    "transactionType" "TransactionType" NOT NULL,
    "orderId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "cancelledReason" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "total" INTEGER NOT NULL,
    "packageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderStatus" "OrderStatus" NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UserNotification_userId_notificationId_key" ON "UserNotification"("userId", "notificationId");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentRegistration_reasonId_key" ON "TournamentRegistration"("reasonId");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentRegistration_tournamentId_userId_tournamentEventI_key" ON "TournamentRegistration"("tournamentId", "userId", "tournamentEventId");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentRegistration_tournamentId_partnerId_key" ON "TournamentRegistration"("tournamentId", "partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "Reason_userVerificationId_key" ON "Reason"("userVerificationId");

-- CreateIndex
CREATE UNIQUE INDEX "Reason_tournamentRegistrationId_key" ON "Reason"("tournamentRegistrationId");

-- CreateIndex
CREATE UNIQUE INDEX "Reason_teamRequestId_key" ON "Reason"("teamRequestId");

-- AddForeignKey
ALTER TABLE "UserVerification" ADD CONSTRAINT "UserVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_teamLeaderId_fkey" FOREIGN KEY ("teamLeaderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvitation" ADD CONSTRAINT "TeamInvitation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvitation" ADD CONSTRAINT "TeamInvitation_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "NotificationType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_teamInvitationId_fkey" FOREIGN KEY ("teamInvitationId") REFERENCES "TeamInvitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_teamRequestId_fkey" FOREIGN KEY ("teamRequestId") REFERENCES "TeamRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tournamentRegistrationId_fkey" FOREIGN KEY ("tournamentRegistrationId") REFERENCES "TournamentRegistration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentSerie" ADD CONSTRAINT "TournamentSerie_belongsToUserId_fkey" FOREIGN KEY ("belongsToUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_tournamentSerieId_fkey" FOREIGN KEY ("tournamentSerieId") REFERENCES "TournamentSerie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentEvent" ADD CONSTRAINT "TournamentEvent_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_leftCompetitorId_fkey" FOREIGN KEY ("leftCompetitorId") REFERENCES "TournamentParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_rightCompetitorId_fkey" FOREIGN KEY ("rightCompetitorId") REFERENCES "TournamentParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_forfeitCompetitorId_fkey" FOREIGN KEY ("forfeitCompetitorId") REFERENCES "TournamentParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_matchWonByCompetitorId_fkey" FOREIGN KEY ("matchWonByCompetitorId") REFERENCES "TournamentParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_umpireId_fkey" FOREIGN KEY ("umpireId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_nextMatchId_fkey" FOREIGN KEY ("nextMatchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_currentServerId_fkey" FOREIGN KEY ("currentServerId") REFERENCES "TournamentParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_gameWonByCompetitorId_fkey" FOREIGN KEY ("gameWonByCompetitorId") REFERENCES "TournamentParticipants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentRegistration" ADD CONSTRAINT "TournamentRegistration_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentRegistration" ADD CONSTRAINT "TournamentRegistration_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentRegistration" ADD CONSTRAINT "TournamentRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentRegistration" ADD CONSTRAINT "TournamentRegistration_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentRegistration" ADD CONSTRAINT "TournamentRegistration_fromTeamId_fkey" FOREIGN KEY ("fromTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentParticipants" ADD CONSTRAINT "TournamentParticipants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentParticipants" ADD CONSTRAINT "TournamentParticipants_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentParticipants" ADD CONSTRAINT "TournamentParticipants_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentParticipants" ADD CONSTRAINT "TournamentParticipants_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentUmpires" ADD CONSTRAINT "TournamentUmpires_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentUmpires" ADD CONSTRAINT "TournamentUmpires_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentPost" ADD CONSTRAINT "TournamentPost_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamRequest" ADD CONSTRAINT "TeamRequest_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamRequest" ADD CONSTRAINT "TeamRequest_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reason" ADD CONSTRAINT "Reason_userVerificationId_fkey" FOREIGN KEY ("userVerificationId") REFERENCES "UserVerification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reason" ADD CONSTRAINT "Reason_tournamentRegistrationId_fkey" FOREIGN KEY ("tournamentRegistrationId") REFERENCES "TournamentRegistration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reason" ADD CONSTRAINT "Reason_teamRequestId_fkey" FOREIGN KEY ("teamRequestId") REFERENCES "TeamRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reason" ADD CONSTRAINT "Reason_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reason" ADD CONSTRAINT "Reason_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentImage" ADD CONSTRAINT "ContentImage_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "TournamentPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
