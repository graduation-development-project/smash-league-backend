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
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import {
	BadmintonParticipantType,
	Tournament,
	TournamentSerie,
} from "@prisma/client";
import { CreateNewTournamentUseCase } from "src/application/usecases/tournament/create-new-tournament.useacase";
import { GetAllBadmintonParticipantTypeUseCase } from "src/application/usecases/tournament/get-all-badminton-participant-type.usecase";
import { GetAllFormatTypeUseCase } from "src/application/usecases/tournament/get-all-format-type.usecase";
import { SearchTournamentUseCase } from "src/application/usecases/tournament/search-tournament.usecase";
import { ApiResponse } from "src/domain/dtos/api-response";
import { FormatType, ITournamentResponse } from "src/domain/interfaces/tournament/tournament.interface";
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
import { CreateTournamentSerie, ModifyTournamentSerie } from "src/domain/interfaces/tournament-serie/tournament-serie.validation";
import { GetAllTournamentSeriesUseCase } from "src/application/usecases/tournament-serie/get-all-tournament-series.usecase";
import { CreateTournamentSerieUseCase } from "src/application/usecases/tournament-serie/create-tournament-serie.usecase";
import { CheckExistTournamentURLUseCase } from "src/application/usecases/tournament/check-exist-tournament-url.usecase";
import { CreateRandomURLUseCase } from "src/application/usecases/tournament/create-random-url.usecase";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { create } from "domain";

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
		private readonly createRandomURLUseCase: CreateRandomURLUseCase
	) {}

	@Put("/modify-tournament-serie")
	async modifyTournamentSerie(@Body() modifyTournamentSerie: ModifyTournamentSerie) : Promise<ApiResponse<TournamentSerie>> {
		return await this.modifyTournamentSerieUseCase.execute(modifyTournamentSerie);
	}

	@Get("/check-exist-tournament-url/:url")
	async checkExistTournamentURL(@Param("url") url: string): Promise<ApiResponse<boolean>> {
		console.log(url);
		return await this.checkExistTournamentURLUseCase.execute(url);
	}

	@Get("/create-random-url")
	async createRandomURL() : Promise<ApiResponse<string>> {
		return await this.createRandomURLUseCase.execute();
	}

	@Post("/demo")
	@UseInterceptors(AnyFilesInterceptor())
	async getData(
		@Body() data: {
			demo
		},
		@UploadedFile() files: Express.Multer.File[]
	) {
		return {
			data: JSON.parse(data.demo),
			files: files
		};
	}

	@Get("get-all-tournament-serie")
	async getAllTournamentSerie() : Promise<ApiResponse<any>> {
		return await this.getAllTournamentSeriesUseCase.execute();
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
		@Body() options: IPaginateOptions
	): Promise<ApiResponse<IPaginatedOutput<Tournament>>> {
		return await this.getTournamentsOfSerieUseCase.execute(id, options);
	}

	// @Post("upload-background-tournament")
	// @UseInterceptors(AnyFilesInterceptor)
	// async 

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
			createTournament
		);
	}

	@Get("/get-all-badminton-participant-type")
	async getAllTournamentEvent(): Promise<
		ApiResponse<BadmintonParticipantType[]>
	> {
		return await this.getAllBadmintonParticipantTypeUseCase.execute();
	}

	@Get("/get-all-format-types")
	async getAllFormatTypes(): Promise<ApiResponse<FormatType[]>> {
		return await this.getAllFormatTypeUseCase.execute();
	}
	
	@Post("/create-tournament-serie")
	@UseGuards(JwtAccessTokenGuard)
	async createTournamentSerie(@Body() tournamentSerie: CreateTournamentSerie) : Promise<ApiResponse<TournamentSerie>>{
		return await this.createTournamentSerieUseCase.execute(tournamentSerie);
	}
}
