import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Put,
	Req,
	UseGuards,
} from "@nestjs/common";
import { GetUserByIdUseCase } from "../../application/usecases/users/get-user-by-id.usecase";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/auth/role.guard";
import { RoleMap } from "../enums/role.enum";
import { TUserWithRole } from "../types/users.type";
import { IRequestUser } from "../interfaces/interfaces";
import { EditUserDTO } from "../../domain/dtos/users/edit-user.dto";
import { EditUserProfileUseCase } from "../../application/usecases/users/edit-user-profile.usecase";
import { ChangePasswordDTO } from "../../domain/dtos/users/change-password.dto";
import { ChangePasswordUseCase } from "../../application/usecases/users/change-password.usecase";

@Controller("/users")
export class UsersController {
	constructor(
		private getUserByIdUseCase: GetUserByIdUseCase,
		private editUserProfileUseCase: EditUserProfileUseCase,
		private changePasswordUseCase: ChangePasswordUseCase,
	) {}

	@Get("/id/:id")
	@Roles(RoleMap.Admin.id, RoleMap.Athlete.id)
	@UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
	getUserById(@Param("id") userID: string): Promise<TUserWithRole> {
		return this.getUserByIdUseCase.execute(userID);
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
}
