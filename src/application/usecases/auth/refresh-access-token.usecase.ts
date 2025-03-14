import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepositoryPort } from "../../../domain/repositories/auth.repository.port";

@Injectable()
export class RefreshAccessTokenUseCase {
	constructor(
		@Inject("AuthRepository") private authRepository: AuthRepositoryPort,
	) {}

	execute(userID: string, roles: string[]): string {
		return this.authRepository.refreshAccessToken(userID, roles);
	}
}
