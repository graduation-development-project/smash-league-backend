import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Put,
	Query,
	Req,
	UseGuards,
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
import { User } from "@prisma/client";
import { IUserResponse } from "src/domain/interfaces/user/user.interface";
import { GetUserProfileUseCase } from "../../application/usecases/users/get-user-profile.usecase";

@Controller("/users")
export class UsersController {
	constructor(
		private getUserByIdUseCase: GetUserByIdUseCase,
		private editUserProfileUseCase: EditUserProfileUseCase,
		private changePasswordUseCase: ChangePasswordUseCase,
		private searchUserByEmail: SearchUserByEmailUseCase,
		private getUserProfileUseCase: GetUserProfileUseCase,
	) {}

	@Get("/id/:id")
	// @Roles(RoleMap.Admin.id, RoleMap.Athlete.id)
	// @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
	getUserById(@Param("id") userID: string): Promise<TUserWithRole> {
		return this.getUserByIdUseCase.execute(userID);
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
}
