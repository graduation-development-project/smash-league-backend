import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Put,
	Query,
	Req,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { GetUserByIdUseCase } from "../../application/usecases/users/get-user-by-id.usecase";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/auth/role.guard";
import { RoleMap } from "../enums/role.enum";
import { TUserWithRole } from "../types/users.type";
import { IRequestUser } from "../../domain/interfaces/interfaces";
import { EditUserDTO } from "../../domain/dtos/users/edit-user.dto";
import { EditUserProfileUseCase } from "../../application/usecases/users/edit-user-profile.usecase";
import { ChangePasswordDTO } from "../../domain/dtos/users/change-password.dto";
import { ChangePasswordUseCase } from "../../application/usecases/users/change-password.usecase";
import { ApiResponse } from "src/domain/dtos/api-response";
import { SearchUserByEmailUseCase } from "src/application/usecases/users/search-user-by-email.usecase";
import { User, UserBankAccount } from "@prisma/client";
import { IUserResponse } from "src/domain/interfaces/user/user.interface";
import { GetUserProfileUseCase } from "../../application/usecases/users/get-user-profile.usecase";
import { AddBankAccountUseCase } from "../../application/usecases/users/add-bank-account.usecase";
import { AddBankAccountDTO } from "../../domain/dtos/users/add-bank-account.dto";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { UploadAvatarUseCase } from "../../application/usecases/users/upload-avatar.usecase";
import { GetUserByRoleUseCase } from "../../application/usecases/users/get-user-by-role.usecase";
import { GetAllUserUseCase } from "../../application/usecases/users/get-all-user.usecase";

@Controller("/users")
export class UsersController {
	constructor(
		private getUserByIdUseCase: GetUserByIdUseCase,
		private getUserByRoleUseCase: GetUserByRoleUseCase,
		private editUserProfileUseCase: EditUserProfileUseCase,
		private changePasswordUseCase: ChangePasswordUseCase,
		private searchUserByEmail: SearchUserByEmailUseCase,
		private getUserProfileUseCase: GetUserProfileUseCase,
		private addBankAccountUseCase: AddBankAccountUseCase,
		private uploadAvatarUseCase: UploadAvatarUseCase,
		private getAllUsersUseCase: GetAllUserUseCase,
	) {}

	@Get("/")
	@Roles(RoleMap.Admin.name, RoleMap.Staff.name)
	@UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
	getAllUsers(): Promise<ApiResponse<User[]>> {
		return this.getAllUsersUseCase.execute();
	}

	@Get("/id/:id")
	// @Roles(RoleMap.Admin.id, RoleMap.Athlete.id)
	// @UseGuards(RolesGuard)
	// @UseGuards(JwtAccessTokenGuard)
	getUserById(@Param("id") userID: string): Promise<TUserWithRole> {
		return this.getUserByIdUseCase.execute(userID);
	}

	@Get("/get-user-by-role/:role")
	getUserByRole(@Param("role") role: string): Promise<User[]> {
		return this.getUserByRoleUseCase.execute(role);
	}

	@Get("/profile")
	@UseGuards(JwtAccessTokenGuard)
	getUserProfile(
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<TUserWithRole>> {
		return this.getUserProfileUseCase.execute(user.id);
	}

	@Patch("/")
	@UseGuards(JwtAccessTokenGuard)
	editUserProfile(
		@Req() { user }: IRequestUser,
		@Body() editUserDTO: EditUserDTO,
	): Promise<TUserWithRole> {
		return this.editUserProfileUseCase.execute(user.id, editUserDTO);
	}

	@Put("/change-password")
	@UseGuards(JwtAccessTokenGuard)
	changePassword(
		@Req() { user }: IRequestUser,
		@Body() changePasswordDTO: ChangePasswordDTO,
	): Promise<TUserWithRole> {
		return this.changePasswordUseCase.execute(user.id, changePasswordDTO);
	}

	@Get("search-users-by-email")
	@UseGuards(JwtAccessTokenGuard)
	async searchUsersByEmail(
		@Query("email") email: string,
	): Promise<ApiResponse<IUserResponse[] | null>> {
		return await this.searchUserByEmail.execute(email);
	}

	@Post("add-bank-account")
	@UseGuards(JwtAccessTokenGuard)
	async addBankAccount(
		@Req() { user }: IRequestUser,
		@Body() addBankAccountDTO: AddBankAccountDTO,
	): Promise<ApiResponse<UserBankAccount>> {
		return await this.addBankAccountUseCase.execute({
			...addBankAccountDTO,
			userId: user.id,
		});
	}

	@UseInterceptors(AnyFilesInterceptor())
	@Post("/upload-avatar")
	async uploadAvatar(
		@UploadedFiles() files: Express.Multer.File[],
	): Promise<ApiResponse<string>> {
		if (files.length > 1)
			return new ApiResponse<null | undefined>(
				HttpStatus.BAD_REQUEST,
				"Files limit to 1.",
				null,
			);
		return this.uploadAvatarUseCase.execute(files);
	}
}
