import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepositoryPort } from "../../../domain/repositories/auth.repository.port";
import { ISignInResponse } from "../../../infrastructure/interfaces/interfaces";

@Injectable()
export class SignInUseCase {
	constructor(
		@Inject("AuthRepository") private authRepository: AuthRepositoryPort,
	) {}

	async execute(userID: number): Promise<ISignInResponse> {
		return this.authRepository.signIn(userID);
	}
}
