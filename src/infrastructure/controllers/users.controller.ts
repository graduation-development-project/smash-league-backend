import { Controller, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { GetUserByIdUseCase } from "../../application/usecases/users/get-user-by-id.usecase";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/auth/role.guard";
import { RoleMap } from "../enums/role.enum";
import { TUserWithRole } from "../types/users.type";

@Controller("/users")
export class UsersController {
	constructor(private getUserByIdUseCase: GetUserByIdUseCase) {
	}

	@Get("/id/:id")
	@Roles(RoleMap.Admin.id, RoleMap.Athlete.id)
	@UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
	getUserById(@Param("id") userID: string): Promise<TUserWithRole> {
		return this.getUserByIdUseCase.execute(userID);
	}
}
