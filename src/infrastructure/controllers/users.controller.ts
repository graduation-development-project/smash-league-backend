import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	UseGuards,
} from "@nestjs/common";
import { GetUserByIdUseCase } from "../../application/usecases/users/get-user-by-id.usecase";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";

@Controller("/users")
export class UsersController {
	constructor(private getUserByIdUseCase: GetUserByIdUseCase) {}

	@UseGuards(JwtAccessTokenGuard)
	@Get("/id/:id")
	getUserById(@Param("id", ParseIntPipe) userID: number) {
		return this.getUserByIdUseCase.execute(userID);
	}
}
