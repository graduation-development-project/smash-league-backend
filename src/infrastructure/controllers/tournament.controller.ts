import { GetTournamentInformationUseCase } from './../../application/usecases/tournament/get-tournament-information.usecase';
import { GenerateBracketUseCase } from "./../../application/usecases/tournament/generate-bracket.usecase";
import { UpdateTournament, UpdateTournamentContact, UpdateTournamentInformation, UpdateTournamentRegistrationInformation } from "./../../domain/interfaces/tournament/tournament.validation";
import {
	Body,
	Controller,
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
	Feedback,
	Tournament,
	TournamentEvent,
	TournamentPost,
	TournamentSerie,
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
import { GetTournamentContactUseCase } from 'src/application/usecases/tournament/get-tournament-contact.usecase';
import { UpdateRegistrationInformationUseCase } from 'src/application/usecases/tournament/update-registration-information.usecase';
import { GetTournamentRegistrationInformationUseCase } from 'src/application/usecases/tournament/get-tournament-registration-information.usecase';

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
		private readonly getTournamentRegistrationInformationUseCase: GetTournamentRegistrationInformationUseCase
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
	async updateTournamentInformation(@Body() updateTournament: UpdateTournamentInformation): Promise<ApiResponse<Tournament>> {
		return await this.updateTournamentInformationUseCase.execute(updateTournament);
	}

	@Put("/update-tournament-contact")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async updateTournamentContact(@Body() updateTournamentContact: UpdateTournamentContact): Promise<ApiResponse<Tournament>> {
		return await this.updateTournamentContactUseCase.execute(updateTournamentContact);
	}

	@Get("/get-tournament-information/:tournamentId")
	async getTournamentInformation(@Param("tournamentId") tournamentId: string): Promise<ApiResponse<ITournamentInformation>> {
		return await this.getTournamentInformationUseCase.execute(tournamentId);
	}

	@Get("/get-tournament-contact/:tournamentId")
	async getTournamentContact(@Param("tournamentId") tournamentId: string): Promise<ApiResponse<ITournamentContact>> {
		return await this.getTournamentContactUseCase.execute(tournamentId);
	}

	@Put("/update-tournament-registration-information")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Organizer.name)
	async updateTournamentRegistrationInformation(@Body() updateTournamentRegistration: UpdateTournamentRegistrationInformation): Promise<ApiResponse<Tournament>> {
		return await this.updateTournamentRegistrationUseCase.execute(updateTournamentRegistration);
	}

	@Get("/get-tournament-registration-information/:tournamentId")
	async getTournamentRegistrationInformation(@Param("tournamentId") tournamentId: string): Promise<ApiResponse<ITournamentRegistrationInformation>> {
		return await this.getTournamentRegistrationInformationUseCase.execute(tournamentId);
	}

}
