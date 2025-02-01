import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";

import { SignUpUseCase } from "../../application/usecases/auth/sign-up.usecase";
import { SignUpDTO } from "../dto/auth/sign-up.dto";
import { SignInDTO } from "../dto/auth/sign-in.dto";
import { SignInUseCase } from "../../application/usecases/auth/sign-in.usecase";
import { LocalAuthGuard } from "../guards/auth/local.guard";
import {
	IRequestUser,
	ISignInResponse,
	ISignUpResponse,
} from "../interfaces/interfaces";
import { JwtRefreshTokenGuard } from "../guards/auth/jwt-refresh-token.guard";
import { RefreshAccessTokenUseCase } from "../../application/usecases/auth/refresh-access-token.usecase";

@Controller("/auth")
export class AuthController {
	constructor(
		private signUpUseCase: SignUpUseCase,
		private signInUseCase: SignInUseCase,
		private refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
	) {}

	@UseGuards(LocalAuthGuard)
	@Post("/sign-in")
	signIn(@Req() request: IRequestUser): Promise<ISignInResponse> {
		const { user } = request;

		// console.log("user", user);

		return this.signInUseCase.execute(user.id);
	}

	@Post("/sign-up")
	signUp(@Body() signUpDTO: SignUpDTO): Promise<ISignUpResponse> {
		return this.signUpUseCase.execute(signUpDTO);
	}

	@UseGuards(JwtRefreshTokenGuard)
	@Post("refresh")
	async refreshAccessToken(@Req() request: IRequestUser) {
		const { user } = request;
		const access_token = this.refreshAccessTokenUseCase.execute(user.id);

		return {
			access_token,
		};
	}
}
