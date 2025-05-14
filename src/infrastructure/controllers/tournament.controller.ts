import { GetAllRequiredAttachmentUseCase } from "./../../application/usecases/tournament/get-all-required-attachment.usecase";
import { GetTournamentInformationUseCase } from "./../../application/usecases/tournament/get-tournament-information.usecase";
import { GenerateBracketUseCase } from "./../../application/usecases/tournament/generate-bracket.usecase";
import {
	UpdateTournament,
	UpdateTournamentContact,
	UpdateTournamentEventsDTO,
	UpdateTournamentInformation,
	UpdateTournamentRegistrationInformation,
	UpdateTournamentScheduleInformation,
} from "./../../domain/interfaces/tournament/tournament.validation";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	Req,
	UploadedFile,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import {
	EventPrize,
	Feedback,
	Sponsor,
	SponsorTier,
	Tournament,
	TournamentEvent,
	TournamentPost,
	TournamentSerie,
	TournamentSponsor,
	TournamentStatus,
	TournamentUmpires,
} from "@prisma/client";
import { CreateNewTournamentUseCase } from "src/application/usecases/tournament/create-new-tournament.useacase";
import { GetAllBadmintonParticipantTypeUseCase } from "src/application/usecases/tournament/get-all-badminton-participant-type.usecase";
import { GetAllFormatTypeUseCase } from "src/application/usecases/tournament/get-all-format-type.usecase";
import { SearchTournamentUseCase } from "src/application/usecases/tournament/search-tournament.usecase";
import { ApiResponse } from "src/domain/dtos/api-response";
import {
	FormatType,
	ITournamentContact,
	ITournamentDetailResponse,
	ITournamentInformation,
	ITournamentRegistrationInformation,
	ITournamentResponse,
	RequiredAttachment,
} from "src/domain/interfaces/tournament/tournament.interface";
import { CreateTournament } from "src/domain/interfaces/tournament/tournament.validation";
import {
	IPaginatedOutput,
	IPaginateOptions,
} from "../../domain/interfaces/interfaces";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { IRequestUser } from "src/domain/interfaces/interfaces";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { RolesGuard } from "../guards/auth/role.guard";
import { GetTournamentsOfTournamentSerieUseCase } from "src/application/usecases/tournament-serie/get-tournaments-of-serie.usecase";
import { ModifyTournamentSerieUseCase } from "src/application/usecases/tournament-serie/modify-tournament-serie.usecase";
import {
	CreateTournamentSerie,
	ModifyTournamentSerie,
} from "src/domain/interfaces/tournament-serie/tournament-serie.validation";
import { GetAllTournamentSeriesUseCase } from "src/application/usecases/tournament-serie/get-all-tournament-series.usecase";
import { CreateTournamentSerieUseCase } from "src/application/usecases/tournament-serie/create-tournament-serie.usecase";
import { CheckExistTournamentURLUseCase } from "src/application/usecases/tournament/check-exist-tournament-url.usecase";
import { CreateRandomURLUseCase } from "src/application/usecases/tournament/create-random-url.usecase";
import {
	AnyFilesInterceptor,
	FileFieldsInterceptor,
	FileInterceptor,
} from "@nestjs/platform-express";
import { create } from "domain";
import { UploadBackgroundImageUseCase } from "src/application/usecases/tournament/upload-background-image.usecase";
import { GetTournamentDetailUseCase } from "src/application/usecases/tournament/get-tournament-detail.usecase";
import { GetMyTournamentSerieUseCase } from "src/application/usecases/tournament-serie/get-my-tournament-serie.usecase";
import { ITournamentSerieResponse } from "src/domain/interfaces/tournament-serie/tournament-serie.interface";
import { UpdateTournamentUseCase } from "src/application/usecases/tournament/update-tournament.usecase";
import {
	IParticipantsOfTournamentEvent,
	ITournamentEventParticipants,
} from "src/domain/interfaces/tournament/tournament-event/tournament-event.interface";
import { GetParticipantsOfTournamentEventUseCase } from "src/application/usecases/tournament/tournament-event/get-participants-of-tournament-event.usecase";
import { UploadMerchandiseImagesUseCase } from "src/application/usecases/tournament/upload-merchandise-images.usecase";
import { BadmintonParticipantType } from "src/domain/interfaces/tournament/badminton-participant-type.interface";
import { KeyValueType } from "src/domain/dtos/key-value-type.type";
import { GetMatchesOfStageUseCase } from "src/application/usecases/tournament/tournament-event/get-matches-of-stage.usecase";
import { GetTournamentPostUseCase } from "../../application/usecases/tournament/get-tournament-post.usecase";
import { GetMatchesOfTournamentEventUseCase } from "src/application/usecases/tournament/tournament-event/get-matches-of-tournament-event.usecase";
import { GetTournamentEventsByTournamentIdUseCase } from "../../application/usecases/tournament/tournament-event/get-tournament-events-by-tournament-id.usecase";
import { GetTournamentUmpireUseCase } from "../../application/usecases/tournament/get-tournament-umpire.usecase";
import { UpdateAttendanceUseCase } from "src/application/usecases/tournament/match/update-attendance.usecase";
import { UpdateForfeitCompetitorUseCase } from "src/application/usecases/tournament/match/update-forfeit-competitor.usecase,";
import { GetTournamentsByUserIdUseCase } from "../../application/usecases/tournament/get-tournaments-by-user-id.usecase";
import { GetTournamentEventStandingBoardUseCase } from "../../application/usecases/tournament/tournament-event/get-tournament-event-standing-board.usecase";
import { ITournamentStandingBoardInterface } from "../../domain/interfaces/tournament/tournament-event/tournament-standing-board.interface";
import { GetFeatureTournamentsUseCase } from "../../application/usecases/tournament/get-feature-tournaments.usecase";
import { GetTournamentsByOrganizerIdUseCase } from "../../application/usecases/tournament/get-tournaments-by-organizer-id.usecase";
import { IParticipantsByTournamentEventResponse } from "src/domain/interfaces/user/athlete.interface";
import { GetParticipantsByTournamentEventUseCase } from "src/application/usecases/tournament/tournament-event/get-participants-by-tournament-event.usecase";
import { UpdateTournamentInformationUseCase } from "src/application/usecases/tournament/update-tournament-information.usecase";
import { GetFeedbacksByTournamentUseCase } from "../../application/usecases/feedback/get-feedbacks-by-tournament.usecase";
import { UpdateContactForTournamentUseCase } from "src/application/usecases/tournament/update-contact-for-tournament.usecase";
import { GetTournamentContactUseCase } from "src/application/usecases/tournament/get-tournament-contact.usecase";
import { UpdateRegistrationInformationUseCase } from "src/application/usecases/tournament/update-registration-information.usecase";
import { GetTournamentRegistrationInformationUseCase } from "src/application/usecases/tournament/get-tournament-registration-information.usecase";
import { CreateTournamentSponsorUseCase } from "../../application/usecases/tournament/sponsor/create-tournament-sponsor.usecase";
import { CreateTournamentSponsorRequestDTO } from "../../domain/dtos/tournament-sponsor/create-tournament-sponsor-request.dto";
import { FindTournamentSponsorUseCase } from "../../application/usecases/tournament/sponsor/find-tournament-sponsor.usecase";
import { CancelTournamentUseCase } from "../../application/usecases/tournament/cancel-tournament.usecase";
import { UpdateTournamentEventInformationUseCase } from "src/application/usecases/tournament/update-tournament-event-information.usecase";
import { UpdateTournamentScheduleInformationUseCase } from "src/application/usecases/tournament/update-tournament-schedule-information.usecase";
import { GetLatestFinishTournamentUseCase } from "../../application/usecases/tournament/get-latest-finish-tournament.usecase";
import { EditTournamentSponsorTierUseCase } from "../../application/usecases/tournament/sponsor/edit-tournament-sponsor-tier.usecase";
import { RemoveTournamentSponsorUseCase } from "../../application/usecases/tournament/sponsor/remove-tournament-sponsor.usecase";
import { UpdateTournamentMerchandiseUseCase } from "../../application/usecases/tournament/update-tournament-merchandise.usecase";
import { UpdateTournamentMerchandiseDTO } from "../../domain/dtos/tournament/update-tournament-merchandise.dto";
import { StaffCancelTournamentUseCase } from "../../application/usecases/tournament/staff-cancel-tournament.usecase";
import { UpdateTournamentRecruitmentUseCase } from "../../application/usecases/tournament/update-tournament-recruitment.usecase";
import { UpdateTournamentRecruitmentDTO } from "../../domain/dtos/tournament/update-tournament-recruitment.dto";
import { SeedParticipantsUseCase } from "../../application/usecases/tournament/seed-participants.usecase";
import enableAutomock = jest.enableAutomock;
import { UpdateTournamentStatusUseCase } from "../../application/usecases/tournament/update-tournament-status.usecase";
import { GetAllPrizeOfEventUseCase } from "src/application/usecases/tournament/tournament-event/get-all-prize-of-event.usecase";
import { GetChampionshipPrizeOfEventUseCase } from "src/application/usecases/tournament/tournament-event/get-championship-prize-of-event.usecase";
import { GetRunnerUpPrizeOfEventUseCase } from "src/application/usecases/tournament/tournament-event/get-runner-up-prize-of-event.usecase";
import { GetThirdPlacePrizesOfEventUseCase } from "src/application/usecases/tournament/tournament-event/get-third-place-prizes-of-event.usecase";
import { CreateEventPrizeUseCase } from "src/application/usecases/tournament/tournament-event/create-event-prize.usecase";
import { IEventPrizeResponse } from "src/domain/dtos/event-prize/event-prize.interface";
import { CreateEventPrizeRequest } from "src/domain/dtos/event-prize/event-prize.validation";

@Controller("/tournaments")
export class TournamentController {
	constructor(
		private readonly searchTournamentUseCase: SearchTournamentUseCase,
		private readonly getAllBadmintonParticipantTypeUseCase: GetAllBadmintonParticipantTypeUseCase,
		private readonly getAllFormatTypeUseCase: GetAllFormatTypeUseCase,
		private readonly createNewTournamentUseCase: CreateNewTournamentUseCase,
		private readonly getTournamentsOfSerieUseCase: GetTournamentsOfTournamentSerieUseCase,
		private readonly modifyTournamentSerieUseCase: ModifyTournamentSerieUseCase,
		private readonly getAllTournamentSeriesUseCase: GetAllTournamentSeriesUseCase,
		private readonly createTournamentSerieUseCase: CreateTournamentSerieUseCase,
		private readonly checkExistTournamentURLUseCase: CheckExistTournamentURLUseCase,
		private readonly createRandomURLUseCase: CreateRandomURLUseCase,
		private readonly uploadBackgroundImageUseCase: UploadBackgroundImageUseCase,
		private readonly getTournamentDetailUseCase: GetTournamentDetailUseCase,
		private readonly getMyTournamentSerieUseCase: GetMyTournamentSerieUseCase,
		private readonly updateTournamentUseCase: UpdateTournamentUseCase,
		private readonly getParticipantsOfTournamentEvent: GetParticipantsOfTournamentEventUseCase,
		private readonly uploadMerchandiseImagesUseCase: UploadMerchandiseImagesUseCase,
		private readonly generateBracketUseCase: GenerateBracketUseCase,
		private readonly getMatchesOfStageUseCase: GetMatchesOfStageUseCase,
		private readonly getTournamentPostUseCase: GetTournamentPostUseCase,
		private readonly getMatchesOfTournamentEventUseCase: GetMatchesOfTournamentEventUseCase,
		private readonly getTournamentEventsByTournamentIdUseCase: GetTournamentEventsByTournamentIdUseCase,
		private readonly getTournamentUmpireUseCase: GetTournamentUmpireUseCase,
		private readonly getTournamentsByUserIdUseCase: GetTournamentsByUserIdUseCase,
		private readonly getTournamentEventStandingBoardUseCase: GetTournamentEventStandingBoardUseCase,
		private readonly getFeatureTournamentsUseCase: GetFeatureTournamentsUseCase,
		private readonly getTournamentsByOrganizerIdUseCase: GetTournamentsByOrganizerIdUseCase,
		private readonly getParticipantsByTournamentEventUseCase: GetParticipantsByTournamentEventUseCase,
		private readonly updateTournamentInformationUseCase: UpdateTournamentInformationUseCase,
		private readonly getFeedbacksByTournamentUseCase: GetFeedbacksByTournamentUseCase,
		private readonly updateTournamentContactUseCase: UpdateContactForTournamentUseCase,
		private readonly getTournamentInformationUseCase: GetTournamentInformationUseCase,
		private readonly getTournamentContactUseCase: GetTournamentContactUseCase,
		private readonly updateTournamentRegistrationUseCase: UpdateRegistrationInformationUseCase,
		private readonly getTournamentRegistrationInformationUseCase: GetTournamentRegistrationInformationUseCase,
		private readonly createTournamentSponsorUseCase: CreateTournamentSponsorUseCase,
		private readonly findTournamentSponsorUseCase: FindTournamentSponsorUseCase,
		private readonly cancelTournamentUseCase: CancelTournamentUseCase,
		private readonly updateTournamentEventInformationUseCase: UpdateTournamentEventInformationUseCase,
		private readonly updateTournamentScheduleInformationUseCase: UpdateTournamentScheduleInformationUseCase,
		private readonly getLatestFinishTournamentUseCase: GetLatestFinishTournamentUseCase,
		private readonly editTournamentSponsorTierUseCase: EditTournamentSponsorTierUseCase,
		private readonly removeTournamentSponsorUseCase: RemoveTournamentSponsorUseCase,
		private readonly getAllRequiredAttachmentUseCase: GetAllRequiredAttachmentUseCase,
		private readonly updateTournamentMerchandiseUseCase: UpdateTournamentMerchandiseUseCase,
		private readonly updateTournamentRecruitmentUseCase: UpdateTournamentRecruitmentUseCase,
		private readonly staffCancelTournamentUseCase: StaffCancelTournamentUseCase,
		private readonly seedParticipantsUseCase: SeedParticipantsUseCase,
		private readonly updateTournamentStatusUseCase: UpdateTournamentStatusUseCase,
		private readonly getAllPrizeofEventUseCase: GetAllPrizeOfEventUseCase,
		private readonly getChampionshipPrizeOfEventUseCase: GetChampionshipPrizeOfEventUseCase,
		private readonly getRunnerUpPrizeOfEventUseCase: GetRunnerUpPrizeOfEventUseCase,
		private readonly getThirdPlacePrizesOfEventUseCase: GetThirdPlacePrizesOfEventUseCase,
		private readonly createNewEventPrizeUseCase: CreateEventPrizeUseCase
	) {}

	@Put("/modify-tournament-serie")
	async modifyTournamentSerie(
		@Body() modifyTournamentSerie: ModifyTournamentSerie,
	): Promise<ApiResponse<TournamentSerie>> {
		return await this.modifyTournamentSerieUseCase.execute(
			modifyTournamentSerie,
		);
	}

	@Get("/check-exist-tournament-url/:url")
	async checkExistTournamentURL(
		@Param("url") url: string,
	): Promise<ApiResponse<boolean>> {
		console.log(url);
		return await this.checkExistTournamentURLUseCase.execute(url);
	}

	@Get("/create-random-url")
	async createRandomURL(): Promise<ApiResponse<string>> {
		return await this.createRandomURLUseCase.execute();
	}

	@Get("/demo")
	async getData(@Query("numberOfGames") numberOfGames: number) {
		return Math.floor(numberOfGames / 2) + 1;
	}

	@Get("get-all-tournament-serie/:userId")
	async getAllTournamentSerieByUser(
		@Param("userId") userId: string,
	): Promise<ApiResponse<TournamentSerie>> {
		return;
	}

	@Get("get-all-tournament-serie")
	@UseGuards(JwtAccessTokenGuard)
	async getAllTournamentSerie(
		@Req() request: IRequestUser,
	): Promise<ApiResponse<ITournamentSerieResponse[]>> {
		return await this.getAllTournamentSeriesUseCase.execute();
	}

	@Get("/get-my-tournament-series")
	@UseGuards(JwtAccessTokenGuard)
	async getMyTournamentSeries(@Req() request: IRequestUser) {
		return await this.getMyTournamentSerieUseCase.execute(request);
	}

	@Get("/search")
	async getAllTournaments(
		@Query() paginateOption: IPaginateOptions,
		@Query("searchTerm") searchTerm: string,
	): Promise<ApiResponse<IPaginatedOutput<ITournamentResponse>>> {
		return await this.searchTournamentUseCase.execute(
			paginateOption,
			searchTerm,
		);
	}

	@Get("/get-tournaments-of-serie/:id")
	async getTournamentsOfSerie(
		@Param("id") id: string,
		@Body() options: IPaginateOptions,
	): Promise<ApiResponse<IPaginatedOutput<Tournament>>> {
		return await this.getTournamentsOfSerieUseCase.execute(id, options);
	}

	@UseInterceptors(AnyFilesInterceptor())
	@Post("upload-background-image")
	async uploadBackgroundImage(
		@UploadedFiles() backgroundImage: Express.Multer.File[],
	): Promise<ApiResponse<string>> {
		return await this.uploadBackgroundImageUseCase.execute(backgroundImage);
	}

	// @UseInterceptors(FileFieldsInterceptor([
	// 	{
	// 		name: 'files', maxCount: 2
	// 	}
	// ]))
	@UseInterceptors(AnyFilesInterceptor())
	@Post("/upload-merchandise-images")
	async uploadMerchandiseImages(
		@UploadedFiles() files: Express.Multer.File[],
	): Promise<ApiResponse<string[]>> {
		if (files.length > 5)
			return new ApiResponse<null | undefined>(
				HttpStatus.BAD_REQUEST,
				"Files limit to 5.",
				null,
			);
		return await this.uploadMerchandiseImagesUseCase.execute(files);
	}

	@Post("/create-tournament")
	@UseGuards(JwtAccessTokenGuard)
	@UseInterceptors(AnyFilesInterceptor())
	@HttpCode(HttpStatus.OK)
	@HttpCode(HttpStatus.BAD_REQUEST)
	@HttpCode(HttpStatus.CREATED)
	async createNewTournament(
		@Req() request: IRequestUser,
		@Body() createTournament: CreateTournament,
		// @UploadedFile() backgroundImage: Express.Multer.File,
		// @UploadedFile() merchandiseImages: Express.Multer.File[]
	): Promise<ApiResponse<Tournament>> {
		// console.log(createTournament);
		// return;
		return await this.createNewTournamentUseCase.execute(
			request,
			createTournament,
		);
	}

	@Get("/get-all-badminton-participant-type")
	async getAllTournamentEvent(): Promise<ApiResponse<KeyValueType<string>[]>> {
		return await this.getAllBadmintonParticipantTypeUseCase.execute();
	}

	@Get("/get-all-format-types")
	async getAllFormatTypes(): Promise<ApiResponse<KeyValueType<string>[]>> {
		return await this.getAllFormatTypeUseCase.execute();
	}

	@Get("/get-all-required-attachment")
	async getAllRequiredAttachment(): Promise<
		ApiResponse<KeyValueType<string>[]>
	> {
		return await this.getAllRequiredAttachmentUseCase.execute();
	}

	@Post("/create-tournament-serie")
	@UseGuards(JwtAccessTokenGuard)
	async createTournamentSerie(
		@Req() request: IRequestUser,
		@Body() tournamentSerie: CreateTournamentSerie,
	): Promise<ApiResponse<TournamentSerie>> {
		return await this.createTournamentSerieUseCase.execute(
			request,
			tournamentSerie,
		);
	}

	@Get("get-tournament-detail/:id")
	async getTournamentDetail(
		@Param("id") id: string,
	): Promise<ApiResponse<ITournamentDetailResponse>> {
		return await this.getTournamentDetailUseCase.execute(id);
	}

	@Put("update-tournament")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Athlete.name, RoleMap.Organizer.name)
	async updateTournament(
		@Body() updateTournament: UpdateTournament,
	): Promise<ApiResponse<Tournament | null>> {
		console.log(updateTournament.merchandiseImages);
		return await this.updateTournamentUseCase.execute(updateTournament);
	}

	@Get("/get-participants-of-tournament-event/:tournamentEventId")
	async getAllParticipantsOfTournamentEvent(
		@Param("tournamentEventId") tournamentEventId: string,
	): Promise<ApiResponse<ITournamentEventParticipants>> {
		return this.getParticipantsOfTournamentEvent.execute(tournamentEventId);
	}

	@Get("/get-participants-by-tournament-event/:tournamentEventId")
	async getAllParticipantsByTournamentEvent(
		@Param("tournamentEventId") tournamentEventId: string,
	): Promise<ApiResponse<IParticipantsOfTournamentEvent>> {
		return this.getParticipantsByTournamentEventUseCase.execute(
			tournamentEventId,
		);
	}

	@Get("/generate-brackets/:tournamentEventId")
	async generateBrackets(
		@Param("tournamentEventId") tournamentEventId: string,
	): Promise<ApiResponse<number>> {
		return await this.generateBracketUseCase.execute(tournamentEventId);
	}

	@Get("/get-matches-of-stage/:stageId")
	async getMatchesOfStage(
		@Param("stageId") stageId: string,
	): Promise<ApiResponse<any>> {
		return await this.getMatchesOfStageUseCase.execute();
	}

	@Get("/tournament-posts/:tournamentId")
	async getTournamentPost(
		@Param("tournamentId") tournamentId: string,
	): Promise<ApiResponse<TournamentPost[]>> {
		return this.getTournamentPostUseCase.execute(tournamentId);
	}

	@Get("/get-matches-of-tournament-event/:tournamentEventId")
	async getMatchesOfTournamentEvent(
		@Param("tournamentEventId") tournamentEventId: string,
	): Promise<ApiResponse<any>> {
		return await this.getMatchesOfTournamentEventUseCase.execute(
			tournamentEventId,
		);
	}

	@Get("/get-tournament-event/:tournamentId")
	async getTournamentEventByTournamentId(
		@Param("tournamentId") tournamentId: string,
	): Promise<ApiResponse<TournamentEvent[]>> {
		return await this.getTournamentEventsByTournamentIdUseCase.execute(
			tournamentId,
		);
	}

	@Get("/get-tournament-umpires/:tournamentId")
	async getTournamentUmpires(
		@Param("tournamentId") tournamentId: string,
	): Promise<ApiResponse<TournamentUmpires[]>> {
		return await this.getTournamentUmpireUseCase.execute(tournamentId);
	}

	@UseGuards(JwtAccessTokenGuard)
	@Get("/get-tournaments-by-organizer")
	async getTournamentByOrganizer(
		@Req() { user }: IRequestUser,
		@Query() paginateOption: IPaginateOptions,
	): Promise<ApiResponse<IPaginatedOutput<ITournamentResponse>>> {
		console.log(user);
		return await this.getTournamentsByUserIdUseCase.execute(
			user.id,
			paginateOption,
		);
	}

	@Get("/get-tournaments-by-organizer-id/:organizerId")
	async getTournamentByOrganizerId(
		@Param("organizerId") organizerId: string,
		@Query() paginateOption: IPaginateOptions,
	): Promise<ApiResponse<IPaginatedOutput<ITournamentResponse>>> {
		return await this.getTournamentsByOrganizerIdUseCase.execute(
			organizerId,
			paginateOption,
		);
	}

	@Get("/get-tournaments-event-standing-board/:tournamentEventId")
	async getTournamentsEventStandingBoard(
		@Param("tournamentEventId") tournamentEventId: string,
	): Promise<ApiResponse<ITournamentStandingBoardInterface>> {
		return await this.getTournamentEventStandingBoardUseCase.execute(
			tournamentEventId,
		);
	}

	@Get("/feature-tournaments")
	async getFeatureTournament(): Promise<ApiResponse<Tournament[]>> {
		return this.getFeatureTournamentsUseCase.execute();
	}

	@Get("/latest-finish-tournaments")
	async getLatestFinishTournaments(
		@Query("limit") limit: number,
	): Promise<ApiResponse<Tournament[]>> {
		return this.getLatestFinishTournamentUseCase.execute(limit);
	}

	@Get("/tournament-feedbacks/:tournamentId")
	async getTournamentFeedbacks(
		@Query() paginateOption: IPaginateOptions,
		@Param("tournamentId") tournamentId: string,
	): Promise<ApiResponse<IPaginatedOutput<Feedback>>> {
		return this.getFeedbacksByTournamentUseCase.execute(
			paginateOption,
			tournamentId,
		);
	}

	@Put("/update-tournament-information")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async updateTournamentInformation(
		@Body() updateTournament: UpdateTournamentInformation,
	): Promise<ApiResponse<Tournament>> {
		return await this.updateTournamentInformationUseCase.execute(
			updateTournament,
		);
	}

	@Put("/update-tournament-contact")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async updateTournamentContact(
		@Body() updateTournamentContact: UpdateTournamentContact,
	): Promise<ApiResponse<Tournament>> {
		return await this.updateTournamentContactUseCase.execute(
			updateTournamentContact,
		);
	}

	@Get("/get-tournament-information/:tournamentId")
	async getTournamentInformation(
		@Param("tournamentId") tournamentId: string,
	): Promise<ApiResponse<ITournamentInformation>> {
		return await this.getTournamentInformationUseCase.execute(tournamentId);
	}

	@Get("/get-tournament-contact/:tournamentId")
	async getTournamentContact(
		@Param("tournamentId") tournamentId: string,
	): Promise<ApiResponse<ITournamentContact>> {
		return await this.getTournamentContactUseCase.execute(tournamentId);
	}

	@Put("/update-tournament-registration-information")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async updateTournamentRegistrationInformation(
		@Body()
		updateTournamentRegistration: UpdateTournamentRegistrationInformation,
	): Promise<ApiResponse<Tournament>> {
		return await this.updateTournamentRegistrationUseCase.execute(
			updateTournamentRegistration,
		);
	}

	@Get("/get-tournament-registration-information/:tournamentId")
	async getTournamentRegistrationInformation(
		@Param("tournamentId") tournamentId: string,
	): Promise<ApiResponse<ITournamentRegistrationInformation>> {
		return await this.getTournamentRegistrationInformationUseCase.execute(
			tournamentId,
		);
	}

	@Get("/get-tournament-sponsor/:tournamentId")
	async findTournamentSponsors(
		@Param("tournamentId") tournamentId: string,
	): Promise<ApiResponse<any>> {
		return this.findTournamentSponsorUseCase.execute(tournamentId);
	}

	@Put("/cancel-tournament/:tournamentId")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async cancelTournament(
		@Param("tournamentId") tournamentId: string,
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<null>> {
		return this.cancelTournamentUseCase.execute(tournamentId);
	}

	@Put("/staff-cancel-tournament/:tournamentId")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Staff.name)
	async staffCancelTournament(
		@Param("tournamentId") tournamentId: string,
	): Promise<ApiResponse<null>> {
		return this.staffCancelTournamentUseCase.execute(tournamentId);
	}

	@Post("/create-tournament-sponsor/:tournamentId")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async createTournamentSponsor(
		@Param("tournamentId") tournamentId: string,
		@Req() { user }: IRequestUser,
		@Body()
		createTournamentSponsor: CreateTournamentSponsorRequestDTO[],
	): Promise<ApiResponse<TournamentSponsor[]>> {
		return this.createTournamentSponsorUseCase.execute(
			tournamentId,
			user.id,
			createTournamentSponsor,
		);
	}

	@Put("/update-tournament-event/:tournamentId")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async updateTournamentEvent(
		@Param("tournamentId") tournamentId: string,
		@Body() updateTournamentEvent: UpdateTournamentEventsDTO,
	): Promise<ApiResponse<TournamentEvent[]>> {
		return await this.updateTournamentEventInformationUseCase.execute(
			tournamentId,
			updateTournamentEvent,
		);
	}

	@Put("/update-tournament-schedule-information")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async updateTournamentScheduleInformation(
		@Body()
		updateTournamentScheduleInformation: UpdateTournamentScheduleInformation,
	): Promise<ApiResponse<Tournament>> {
		return await this.updateTournamentScheduleInformationUseCase.execute(
			updateTournamentScheduleInformation,
		);
	}

	@Put("/update-tournament-merchandise/:tournamentId")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async updateTournamentMerchandise(
		@Param("tournamentId") tournamentId: string,
		@Body()
		updateTournamentMerchandiseDTO: UpdateTournamentMerchandiseDTO,
	): Promise<ApiResponse<Tournament>> {
		return await this.updateTournamentMerchandiseUseCase.execute(
			tournamentId,
			updateTournamentMerchandiseDTO,
		);
	}

	@Put("/update-tournament-recruitment/:tournamentId")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async updateTournamentRecruitment(
		@Param("tournamentId") tournamentId: string,
		@Body()
		updateTournamentRecruitmentDTO: UpdateTournamentRecruitmentDTO,
	): Promise<ApiResponse<Tournament>> {
		return await this.updateTournamentRecruitmentUseCase.execute(
			tournamentId,
			updateTournamentRecruitmentDTO,
		);
	}

	@Put("/update-tournament-status/:tournamentId")
	async updateTournamentStatus(
		@Param("tournamentId") tournamentId: string,
		@Body("tournamentStatus")
		tournamentStatus: TournamentStatus,
	): Promise<ApiResponse<Tournament>> {
		return await this.updateTournamentStatusUseCase.execute(
			tournamentId,
			tournamentStatus,
		);
	}

	@Put("/edit-tournament-sponsor")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async editTournamentSponsor(
		@Body()
		{
			tournamentId,
			sponsorId,
			tier,
		}: {
			tournamentId: string;
			sponsorId: string;
			tier: SponsorTier;
		},
	): Promise<ApiResponse<TournamentSponsor>> {
		return await this.editTournamentSponsorTierUseCase.execute(
			tournamentId,
			sponsorId,
			tier,
		);
	}

	@Delete("/remove-tournament-sponsor/:tournamentId/:sponsorId")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async removeTournamentSponsor(
		@Param("tournamentId") tournamentId: string,
		@Param("sponsorId") sponsorId: string,
	): Promise<ApiResponse<void>> {
		return await this.removeTournamentSponsorUseCase.execute(
			tournamentId,
			sponsorId,
		);
	}

	@Post("/seed-participant/:tournamentId/:eventId")
	async seedParticipants(
		@Param("tournamentId") tournamentId: string,
		@Param("eventId") eventId: string,
	): Promise<void> {
		return await this.seedParticipantsUseCase.execute(tournamentId, eventId);
	}

	@Get("/get-all-prize-of-event/:tournamentEventId")
	async getAllPrizeOfEvent(@Param("tournamentEventId") tournamentEventId: string): Promise<ApiResponse<IEventPrizeResponse[]>> {
		return await this.getAllPrizeofEventUseCase.execute(tournamentEventId);
	}

	@Get("/get-championship-prize-of-event/:tournamentEventId")
	async getChampionshipPrizeOfEvent(@Param("tournamentEventId") tournamentEventId: string): Promise<ApiResponse<IEventPrizeResponse>> {
		return await this.getChampionshipPrizeOfEventUseCase.execute(tournamentEventId);
	}

	@Get("/get-runner-up-prize-of-event/:tournamentEventId")
	async getRunnerUpPrizeOfEvent(@Param("tournamentEventId") tournamentEventId: string): Promise<ApiResponse<IEventPrizeResponse>> {
		return await this.getRunnerUpPrizeOfEventUseCase.execute(tournamentEventId);
	}

	@Get("/get-third-place-prizes-of-event/:tournamentEventId")
	async getThirdPlacePrizesOfEvent(@Param("tournamentEventId") tournamentEventId: string): Promise<ApiResponse<IEventPrizeResponse[]>> {
		return await this.getThirdPlacePrizesOfEventUseCase.execute(tournamentEventId);
	}

	@Post("/create-event-prize")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async createEventPrize(@Body() createEventPrize: CreateEventPrizeRequest): Promise<ApiResponse<EventPrize>> {
		return await this.createNewEventPrizeUseCase.execute(createEventPrize);
	}
}
