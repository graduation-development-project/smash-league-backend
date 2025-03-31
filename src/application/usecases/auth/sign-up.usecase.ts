import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "@prisma/client";
import { SignUpDTO } from "../../../domain/dtos/auth/sign-up.dto";
import { AuthRepositoryPort } from "../../../domain/interfaces/repositories/auth.repository.port";
import {ISignUpResponse} from "../../../domain/interfaces/interfaces";

@Injectable()
export class SignUpUseCase {
	constructor(
		@Inject("AuthRepository") private authRepository: AuthRepositoryPort,
	) {}

	async execute(signUpDTO: SignUpDTO): Promise<string> {
		return this.authRepository.signUp(signUpDTO);
	}
}
