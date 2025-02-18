import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "@prisma/client";
import { SignUpDTO } from "../../../domain/dtos/auth/sign-up.dto";
import { AuthRepositoryPort } from "../../../domain/repositories/auth.repository.port";
import { ISignUpResponse } from "../../../infrastructure/interfaces/interfaces";

@Injectable()
export class VerifyOTPUseCase {
	constructor(
		@Inject("AuthRepository") private authRepository: AuthRepositoryPort,
	) {}

	async execute(email: string, otp: string): Promise<string> {
		return this.authRepository.verifyOTP(email, otp);
	}
}
