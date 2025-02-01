import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "@prisma/client";
import { SignUpDTO } from "../../../infrastructure/dto/auth/sign-up.dto";
import { AuthRepositoryPort } from "../../../domain/repositories/auth.repository.port";
import {ISignUpResponse} from "../../../infrastructure/interfaces/interfaces";

@Injectable()
export class SignUpUseCase {
	constructor(
		@Inject("AuthRepository") private authRepository: AuthRepositoryPort,
	) {}

	async execute(signUpDTO: SignUpDTO): Promise<ISignUpResponse> {
		return this.authRepository.signUp(signUpDTO);
	}
}
