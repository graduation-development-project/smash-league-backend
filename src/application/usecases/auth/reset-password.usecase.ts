import { Inject, Injectable } from "@nestjs/common";
import { AuthRepositoryPort } from "../../../domain/repositories/auth.repository.port";
import { ResetPasswordDTO } from "../../../infrastructure/dto/auth/reset-password.dto";

@Injectable()
export class ResetPasswordUseCase {
	constructor(
		@Inject("AuthRepository") private authRepository: AuthRepositoryPort,
	) {}

	execute(resetPasswordDTO: ResetPasswordDTO): Promise<string> {
		return this.authRepository.resetPassword(resetPasswordDTO);
	}
}
