import { Body, Controller, Post, Put, Req, UseGuards } from "@nestjs/common";

import { SignUpUseCase } from "../../application/usecases/auth/sign-up.usecase";
import { SignUpDTO } from "../../domain/dtos/auth/sign-up.dto";
import { SignInDTO } from "../../domain/dtos/auth/sign-in.dto";
import { SignInUseCase } from "../../application/usecases/auth/sign-in.usecase";
import { LocalAuthGuard } from "../guards/auth/local.guard";
import {
	IRequestUser,
	ISignInResponse,
	ISignUpResponse,
} from "../interfaces/interfaces";
import { JwtRefreshTokenGuard } from "../guards/auth/jwt-refresh-token.guard";
import { RefreshAccessTokenUseCase } from "../../application/usecases/auth/refresh-access-token.usecase";
import { VerifyOTPUseCase } from "../../application/usecases/auth/verify-otp.usecase";
import { VerifyOTPDTO } from "../../domain/dtos/auth/verify-otp.dto";
import { SendResetPasswordLinkUseCase } from "../../application/usecases/auth/send-reset-password-link.usecase";
import { ResetPasswordDTO } from "../../domain/dtos/auth/reset-password.dto";
import { ResetPasswordUseCase } from "../../application/usecases/auth/reset-password.usecase";

@Controller("/auth")
export class AuthController {
	constructor(
		private signUpUseCase: SignUpUseCase,
		private signInUseCase: SignInUseCase,
		private refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
		private verifyOTPUseCase: VerifyOTPUseCase,
		private sendResetPasswordLinkUseCase: SendResetPasswordLinkUseCase,
		private resetPasswordUseCase: ResetPasswordUseCase,
	) {}

	@UseGuards(LocalAuthGuard)
	@Post("/sign-in")
	signIn(@Req() request: IRequestUser): Promise<ISignInResponse> {
		const { user } = request;

		// console.log("user", user);

		return this.signInUseCase.execute(user.id);
	}

	@Post("/sign-up")
	signUp(@Body() signUpDTO: SignUpDTO): Promise<string> {
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

	@Put("/verify-otp")
	verifyOTP(@Body() verifyOTPDTO: VerifyOTPDTO): Promise<string> {
		// console.log(verifyOTPDTO);
		return this.verifyOTPUseCase.execute(verifyOTPDTO.email, verifyOTPDTO.otp);
	}

	@Post("/send-reset-password-link")
	sendResetPasswordLink(@Body("email") email: string): Promise<string> {
		return this.sendResetPasswordLinkUseCase.execute(email);
	}

	@Put("/reset-password")
	resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO): Promise<string> {
		return this.resetPasswordUseCase.execute(resetPasswordDTO);
	}
}
