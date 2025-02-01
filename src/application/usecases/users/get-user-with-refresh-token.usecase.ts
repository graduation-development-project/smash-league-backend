import { Inject, Injectable } from "@nestjs/common";
import { UsersRepositoryPort } from "../../../domain/repositories/users.repository.port";
import { User } from "@prisma/client";

@Injectable()
export class GetUserWithRefreshTokenUseCase {
	constructor(
		@Inject("UserRepository") private userRepository: UsersRepositoryPort,
	) {}

	async execute(userID: number, refreshToken: string): Promise<User> {
		return await this.userRepository.getUserWithRefreshToken(
			userID,
			refreshToken,
		);
	}
}
