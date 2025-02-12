import { Body, Controller, Get, Param, ParseIntPipe, Patch, Req, UseGuards } from "@nestjs/common";
import { GetUserByIdUseCase } from "../../application/usecases/users/get-user-by-id.usecase";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/auth/role.guard";
import { RoleMap } from "../enums/role.enum";
import { TUserWithRole } from "../types/users.type";
import { IRequestUser } from "../interfaces/interfaces";
import { EditUserDTO } from "../dto/users/edit-user.dto";
import { EditUserProfileUseCase } from "../../application/usecases/users/edit-user-profile.usecase";

@Controller("/users")
export class UsersController {
	constructor(private getUserByIdUseCase: GetUserByIdUseCase, private editUserProfileUseCase: EditUserProfileUseCase) {
	}

	@Get("/id/:id")
	@Roles(RoleMap.Admin.id, RoleMap.Athlete.id)
	@UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
	getUserById(@Param("id") userID: string): Promise<TUserWithRole> {
		return this.getUserByIdUseCase.execute(userID);
	}

	@Patch("/")
	@UseGuards(JwtAccessTokenGuard)
	editUserProfile(@Req() { user }: IRequestUser, @Body() editUserDTO: EditUserDTO): Promise<TUserWithRole> {
		return this.editUserProfileUseCase.execute(user.id, editUserDTO);
	}


}
