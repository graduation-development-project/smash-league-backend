import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	Req,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { RegisterTournamentDTO } from "../../domain/dtos/athletes/register-tournament.dto";
import { RegisterTournamentUseCase } from "../../application/usecases/athletes/register-tournament.usecase";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import {
	Tournament,
	TournamentRegistration,
	UserVerification,
} from "@prisma/client";
import { GetParticipatedTournamentsUseCase } from "../../application/usecases/athletes/get-participated-tournaments.usecase";
import { IRequestUser } from "../../domain/interfaces/interfaces";
import { RegisterNewRoleUseCase } from "../../application/usecases/athletes/register-new-role.usecase";
import { RegisterNewRoleDTO } from "../../domain/dtos/athletes/register-new-role.dto";
import { TUserWithRole } from "../types/users.type";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { UploadVerificationImagesUseCase } from "../../application/usecases/athletes/upload-verification-images.usecase";
import { TCloudinaryResponse } from "../types/cloudinary.type";

@Controller("/athletes")
@UseGuards(JwtAccessTokenGuard, RolesGuard)
@Roles(RoleMap.Athlete.name)
export class AthletesController {
	constructor(
		private registerTournamentUseCase: RegisterTournamentUseCase,
		private getParticipatedTournamentsUseCase: GetParticipatedTournamentsUseCase,
		private registerNewRoleUseCase: RegisterNewRoleUseCase,
		private uploadVerificationImagesUseCase: UploadVerificationImagesUseCase,
	) {}

	@Post("register-tournament")
	registerTournament(
		@Body() registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentRegistration> {
		return this.registerTournamentUseCase.execute(registerTournamentDTO);
	}

	@Get("participated-tournament")
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
	@UseInterceptors(AnyFilesInterceptor())
	uploadVerificationImage(
		@Req() { user }: IRequestUser,
		@UploadedFiles() files: Express.Multer.File[],
	): Promise<TCloudinaryResponse[]> {
		console.log("files", files);
		return this.uploadVerificationImagesUseCase.execute(files, user.id);
	}

	@Post("register-new-role")
	registerNewRole(
		@Req() { user }: IRequestUser,
		@Body() registerNewRoleDTO: RegisterNewRoleDTO,
	): Promise<UserVerification> {
		return this.registerNewRoleUseCase.execute(user.id, registerNewRoleDTO);
	}
}
