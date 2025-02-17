import { Inject, Injectable } from "@nestjs/common";
import { AuthRepositoryPort } from "../../../domain/repositories/auth.repository.port";

@Injectable()
export class SendResetPasswordLinkUseCase {
	constructor(
		@Inject("AuthRepository") private authRepository: AuthRepositoryPort,
	) {}

	execute(email: string): Promise<string> {
		return this.authRepository.sendResetPasswordLink(email);
	}
}
