import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersRepositoryPort } from "../../../domain/interfaces/repositories/users.repository.port";
import { User } from "@prisma/client";

@Injectable()
export class GetAuthenticatedUserUseCase {
	constructor(
		@Inject("UserRepository") private userRepository: UsersRepositoryPort,
	) {}

	async execute(email: string, password: string): Promise<User> {
		return this.userRepository.getAuthenticatedUser(email, password);
	}
}
