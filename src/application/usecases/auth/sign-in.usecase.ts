import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepositoryPort } from "../../../domain/repositories/auth.repository.port";
import { ISignInResponse } from "../../../infrastructure/interfaces/interfaces";
import { TUserWithRole } from "src/infrastructure/types/users.type";

@Injectable()
export class SignInUseCase {
	constructor(
		@Inject("AuthRepository") private authRepository: AuthRepositoryPort,
	) {}

	async execute(user: TUserWithRole): Promise<ISignInResponse> {
		return this.authRepository.signIn(user);
	}
}
