import { Inject, Injectable } from "@nestjs/common";
import { UsersRepositoryPort } from "../../../domain/interfaces/repositories/users.repository.port";
import { User } from "@prisma/client";

@Injectable()
export class GetUserByEmailUseCase {
	constructor(
		@Inject("UserRepository") private userRepository: UsersRepositoryPort,
	) {}

	async execute(email: string): Promise<User> {
		return await this.userRepository.getUserByEmail(email);
	}
}
