import { CreateUmpireDegreeDto } from './../../domain/dtos/umpire/umpire-degree.validation';
import {
	Body,
	Controller,
	Get,
	Put,
	Req,
	Param,
	UseGuards,
	Post,
	UseInterceptors,
	UploadedFiles,
	Delete,
} from "@nestjs/common";
import { UmpireUpdateMatchDTO } from "../../domain/dtos/umpire/umpire-update-match.dto";
import { UmpireUpdateMatchUseCase } from "../../application/usecases/umpires/umpire-update-match.usecase";
import { ApiResponse } from "../../domain/dtos/api-response";
import { IRequestUser } from "../../domain/interfaces/interfaces";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { Match, Tournament, UmpireDegree } from "@prisma/client";
import { GetAssignedMatchUseCase } from "../../application/usecases/umpires/get-assigned-match.usecase";
import { GetUmpireParticipatedTournamentsUseCase } from "../../application/usecases/umpires/get-participated-tournaments.usecase";
import { GetAllAssignedMatchesUsecase } from "../../application/usecases/umpires/get-all-assigned-matches.usecase";
import { CreateUmpireDegreeUseCase } from "src/application/usecases/umpires/create-umpire-degree.usecase";
import { UmpireDegreeResponse } from 'src/domain/dtos/umpire/umpire-degree.interface';
import { GetAllUmpireDegreesUseCase } from 'src/application/usecases/umpires/get-all-umpire-degress.usecase';
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { KeyValueType } from 'src/domain/dtos/key-value-type.type';
import { GetAllDegreeTypeUseCase } from 'src/application/usecases/umpires/get-all-degrees-type.usecase';
import { DeleteUmpireDegreeUseCase } from 'src/application/usecases/umpires/delete-umpire-degree.usecase';
import { GetPersonalUmpireDegreesUseCase } from 'src/application/usecases/umpires/get-personal-umpire-degrees.usecase';

@Controller("/umpires")

export class UmpireController {
	constructor(
		private umpireUpdateMatchUseCase: UmpireUpdateMatchUseCase,
		private getAssignedMatchUseCase: GetAssignedMatchUseCase,
		private getAllAssignedMatchesUsecase: GetAllAssignedMatchesUsecase,
		private getUmpireParticipatedTournamentsUseCase: GetUmpireParticipatedTournamentsUseCase,
		private readonly createUmpireDegreeUseCase: CreateUmpireDegreeUseCase,
		private readonly getAllUmpireDegreeUseCase: GetAllUmpireDegreesUseCase,
		private readonly getAllDegreeTypeUseCase: GetAllDegreeTypeUseCase,
		private readonly deleteUmpireDegreeUseCase: DeleteUmpireDegreeUseCase,
		private readonly getPersonalUmpireDegressUseCase: GetPersonalUmpireDegreesUseCase
	) {}

	@Put("/update-match")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Umpire.name)
	async updateMatch(
		@Body() umpireUpdateMatchDTO: UmpireUpdateMatchDTO,
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<null>> {
		return this.umpireUpdateMatchUseCase.execute({
			...umpireUpdateMatchDTO,
			user,
		});
	}

	@Get("/assigned-matches/:tournamentId")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Umpire.name)
	async getAssignedMatches(
		@Req() { user }: IRequestUser,
		@Param("tournamentId") tournamentId: string,
	): Promise<ApiResponse<Match[]>> {
		return this.getAssignedMatchUseCase.execute(tournamentId, user.id);
	}

	@Get("/all-assigned-matches")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Umpire.name)
	async getAllAssignedMatches(
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<Match[]>> {
		return this.getAllAssignedMatchesUsecase.execute(user.id);
	}

	@Get("/participate-tournaments")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Umpire.name, RoleMap.Athlete.name)
	async getParticipateTournaments(
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<Tournament[]>> {
		return this.getUmpireParticipatedTournamentsUseCase.execute(user.id);
	}

	@UseInterceptors(AnyFilesInterceptor())
	@Post("/create-umpire-degree")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Umpire.name, RoleMap.Athlete.name)
	async createUmpireDegree(@Req() request: IRequestUser,
		@Body() createUmpireDegree: CreateUmpireDegreeDto,
		@UploadedFiles() files: Express.Multer.File[]): Promise<ApiResponse<any>> {
			// console.log(createUmpireDegree);
			// return;
			return await this.createUmpireDegreeUseCase.execute(request, createUmpireDegree, files);
		}
	
	@Get("/get-umpire-degrees/:umpireId")
	async getAllUmpireDegress(@Param("umpireId") umpireId: string): Promise<ApiResponse<UmpireDegreeResponse[]>> {
		return await this.getAllUmpireDegreeUseCase.execute(umpireId);
	}

	@Get("/get-all-umpire-degrees-type")
	async getAllUmpireDegreesType(): Promise<ApiResponse<KeyValueType<string>[]>> {
		return await this.getAllDegreeTypeUseCase.execute();
	}

	@Delete("/delete-umpire-degree/:degreeId")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Umpire.name, RoleMap.Athlete.name)
	async deleteUmpireDegree(@Param("degreeId") degreeId: string): Promise<ApiResponse<any>> {
		return await this.deleteUmpireDegreeUseCase.execute(degreeId);
	}

	@Get("/get-personal-umpire-degrees")
	@UseGuards(JwtAccessTokenGuard, RolesGuard)
	@Roles(RoleMap.Umpire.name, RoleMap.Athlete.name)
	async getPersonalUmpireDegree(@Req() request: IRequestUser): Promise<ApiResponse<UmpireDegreeResponse[]>> {
		return await this.getPersonalUmpireDegressUseCase.execute(request);
	}
}
