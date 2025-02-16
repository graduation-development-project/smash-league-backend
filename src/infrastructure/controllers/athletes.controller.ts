import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	Query,
	Req,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { RegisterTournamentDTO } from "../dto/athletes/register-tournament.dto";
import { RegisterTournamentUseCase } from "../../application/usecases/athletes/register-tournament.usecase";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { Tournament, TournamentParticipant } from "@prisma/client";
import { GetParticipatedTournamentsUseCase } from "../../application/usecases/athletes/get-participated-tournaments.usecase";
import { IRequestUser } from "../interfaces/interfaces";
import { RegisterNewRoleUseCase } from "../../application/usecases/athletes/register-new-role.usecase";
import { RegisterNewRoleDTO } from "../dto/athletes/register-new-role.dto";
import { TUserWithRole } from "../types/users.type";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { UploadVerificationImagesUseCase } from "../../application/usecases/athletes/upload-verification-images.usecase";
import { TCloudinaryResponse } from "../types/cloudinary.type";

@Controller("/athletes")
export class AthletesController {
	constructor(
		private registerTournamentUseCase: RegisterTournamentUseCase,
		private getParticipatedTournamentsUseCase: GetParticipatedTournamentsUseCase,
		private registerNewRoleUseCase: RegisterNewRoleUseCase,
		private uploadVerificationImagesUseCase: UploadVerificationImagesUseCase,
	) {}

	@Post("register-tournament")
	@Roles(RoleMap.Athlete.id)
	@UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
	registerTournament(
		@Body() registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentParticipant> {
		return this.registerTournamentUseCase.execute(registerTournamentDTO);
	}

	@Get("participated-tournament")
	@Roles(RoleMap.Athlete.id)
	@UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
	getParticipatedTournaments(
		@Req() { user }: IRequestUser,
		@Query("status") tournamentStatus: string,
	): Promise<Tournament[]> {
		return this.getParticipatedTournamentsUseCase.execute(
			user.id,
			tournamentStatus,
		);
	}

	@Post("upload-verification-images")
	@Roles(RoleMap.Athlete.id)
	@UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
	@UseInterceptors(AnyFilesInterceptor())
	uploadVerificationImage(
		@Req() { user }: IRequestUser,
		@UploadedFiles() files: Express.Multer.File[],
	): Promise<TCloudinaryResponse[]> {
		return this.uploadVerificationImagesUseCase.execute(files, user.id);
	}

	@Put("register-new-role")
	@Roles(RoleMap.Athlete.id)
	@UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
	registerNewRole(
		@Req() { user }: IRequestUser,
		@Body() registerNewRoleDTO: RegisterNewRoleDTO,
	): Promise<TUserWithRole> {
		return this.registerNewRoleUseCase.execute(user.id, registerNewRoleDTO);
	}
}
